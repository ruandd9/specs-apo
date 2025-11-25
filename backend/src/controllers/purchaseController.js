// Log para debug - verificar se a chave está sendo carregada
console.log('🔑 Stripe Key carregada:', process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...` : 'NÃO ENCONTRADA');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Purchase = require('../models/Purchase');
const Material = require('../models/Material');
const User = require('../models/User');

const createCheckoutSession = async (req, res) => {
  try {
    console.log('📦 Body recebido:', req.body);
    console.log('📦 Headers:', req.headers['content-type']);
    console.log('📦 Raw body type:', typeof req.body);
    console.log('📦 Body keys:', Object.keys(req.body || {}));
    console.log('📦 Full request headers:', req.headers);
    
    const { materialId } = req.body;
    const user = req.user;
    
    console.log('🛒 Criando sessão de checkout:', { materialId, userId: user._id });
    
    // Find the material
    const material = await Material.findById(materialId);
    console.log('📚 Material encontrado:', material ? material.title : 'não encontrado');
    
    if (!material || !material.isActive) {
      return res.status(404).json({ message: 'Material not found or inactive' });
    }
    
    // Check if user already owns this material
    if (user.ownedMaterials.includes(materialId)) {
      return res.status(400).json({ message: 'You already own this material' });
    }
    
    console.log('💳 Criando sessão Stripe...');
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: material.title,
              description: material.description,
            },
            unit_amount: Math.round(material.price * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: materialId,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        materialId: materialId
      }
    });
    
    console.log('✅ Sessão Stripe criada:', session.id);
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Erro ao criar checkout:', error);
    res.status(500).json({ message: error.message });
  }
};

const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Fulfill the purchase
        await fulfillPurchase(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};

const fulfillPurchase = async (session) => {
  try {
    const userId = session.metadata.userId;
    const materialId = session.client_reference_id;
    const stripePaymentId = session.id;
    const amount = session.amount_total / 100; // Convert from cents
    
    // Create purchase record
    const purchase = new Purchase({
      user: userId,
      material: materialId,
      amount,
      stripePaymentId,
      status: 'completed'
    });
    
    await purchase.save();
    
    // Add material to user's owned materials
    await User.findByIdAndUpdate(userId, {
      $addToSet: { ownedMaterials: materialId }
    });
    
    console.log(`Purchase fulfilled for user ${userId} and material ${materialId}`);
  } catch (error) {
    console.error('Error fulfilling purchase:', error);
    throw error;
  }
};

const getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate('material', 'title description price')
      .sort({ createdAt: -1 });
    
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('material', 'title description price');
    
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPaymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.body;
    const user = req.user;
    
    console.log('🔍 Verificando pagamento:', { session_id, userId: user._id });
    
    // Buscar a sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    console.log('📋 Sessão Stripe:', {
      status: session.payment_status,
      materialId: session.client_reference_id,
      userId: session.metadata.userId
    });
    
    // Verificar se o pagamento foi bem-sucedido
    if (session.payment_status === 'paid') {
      const materialId = session.client_reference_id;
      
      // Verificar se já existe uma compra registrada
      const existingPurchase = await Purchase.findOne({
        user: user._id,
        material: materialId,
        stripePaymentId: session_id
      });
      
      if (existingPurchase) {
        console.log('✅ Compra já registrada');
        return res.json({ success: true, message: 'Purchase already registered' });
      }
      
      // Criar registro de compra
      const purchase = new Purchase({
        user: user._id,
        material: materialId,
        amount: session.amount_total / 100,
        stripePaymentId: session_id,
        status: 'completed'
      });
      
      await purchase.save();
      
      // Adicionar material aos materiais do usuário
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { ownedMaterials: materialId }
      });
      
      console.log('✅ Compra registrada com sucesso');
      
      res.json({ success: true, message: 'Purchase registered successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('❌ Erro ao verificar pagamento:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
  getUserPurchases,
  getPurchaseById,
  verifyPaymentSuccess
};