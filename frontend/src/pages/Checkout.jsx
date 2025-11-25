import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await api.getMaterialById(token, id);
        
        // Verificar se o usuário já possui este material
        if (user.ownedMaterials?.includes(id)) {
          navigate(`/view/${id}`);
          return;
        }
        
        setMaterial(data);
      } catch (err) {
        setError(err.message || 'Falha ao carregar detalhes do material');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMaterial();
    }
  }, [id, token, user, navigate]);

  const handleCheckout = async () => {
    setProcessing(true);
    setError('');
    
    try {
      // Criar sessão de checkout no Stripe
      const response = await api.createCheckoutSession(token, id);
      
      // Redirecionar para o Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (err) {
      setError(err.message || 'Falha ao processar pagamento. Tente novamente.');
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Carregando checkout...</div>;
  if (error && !material) return <div className="error">{error}</div>;
  if (!material) return <div className="error">Material não encontrado</div>;

  return (
    <div className="checkout">
      <h2>Finalizar Compra</h2>
      
      <div className="checkout-summary">
        <h3>Resumo do Pedido</h3>
        <div className="order-item">
          <div>
            <h4>{material.title}</h4>
            <p>{material.description}</p>
          </div>
          <span className="item-price">R$ {material.price.toFixed(2)}</span>
        </div>
        <div className="order-total">
          <strong>Total:</strong>
          <strong>R$ {material.price.toFixed(2)}</strong>
        </div>
      </div>
      
      <div className="payment-section">
        <h3>Método de Pagamento</h3>
        <div className="payment-info">
          <p>💳 Pagamento seguro via Stripe</p>
          <p>✅ Aceitamos cartões de crédito e débito</p>
          <p>🔒 Seus dados estão protegidos</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <button 
          className="btn btn-primary btn-lg" 
          onClick={handleCheckout}
          disabled={processing}
        >
          {processing ? 'Processando...' : `Pagar R$ ${material.price.toFixed(2)}`}
        </button>
        
        <p className="checkout-note">
          Você será redirecionado para a página segura de pagamento do Stripe
        </p>
      </div>
    </div>
  );
};

export default Checkout;