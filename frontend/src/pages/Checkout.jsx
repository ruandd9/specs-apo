import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Icon from '../components/Icon';

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
      console.log('🛒 Iniciando checkout:', { 
        materialId: id, 
        token: token ? 'presente' : 'ausente',
        materialData: material 
      });
      
      // Criar sessão de checkout no Stripe
      const response = await api.createCheckoutSession(token, id);
      
      console.log('✅ Resposta do checkout:', response);
      
      // Redirecionar para o Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (err) {
      console.error('❌ Erro no checkout:', err);
      setError(err.message || 'Falha ao processar pagamento. Tente novamente.');
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Carregando checkout...</div>;
  if (error && !material) return <div className="error">{error}</div>;
  if (!material) return <div className="error">Material não encontrado</div>;

  return (
    <div className="checkout">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1>Finalizar Compra</h1>
          <p className="checkout-subtitle">Você está a um passo de ter acesso ao material completo</p>
        </div>

        {/* Resumo do Pedido */}
        <div className="checkout-card">
          <div className="card-section">
            <h3 className="section-title-small">
              <Icon name="box-open" size="sm" /> Resumo do Pedido
            </h3>
            <div className="order-item-modern">
              <div className="item-details">
                <h4>{material.title}</h4>
                <p>{material.description}</p>
              </div>
              <div className="item-price-modern">R$ {material.price.toFixed(2)}</div>
            </div>
            <div className="order-divider"></div>
            <div className="order-total-modern">
              <span className="total-label">Total a Pagar:</span>
              <span className="total-value">R$ {material.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="card-section payment-section-modern">
            <h3 className="section-title-small">
              <Icon name="credit-card" size="sm" /> Pagamento Seguro
            </h3>
            <div className="payment-features">
              <div className="payment-feature-item">
                <span className="feature-icon-payment">
                  <Icon name="lock" size="sm" />
                </span>
                <span>Pagamento 100% seguro via Stripe</span>
              </div>
              <div className="payment-feature-item">
                <span className="feature-icon-payment">
                  <Icon name="credit-card" size="sm" />
                </span>
                <span>Cartões de crédito e débito</span>
              </div>
              <div className="payment-feature-item">
                <span className="feature-icon-payment">
                  <Icon name="bolt" size="sm" />
                </span>
                <span>Acesso imediato após aprovação</span>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="checkout-error">
              <span className="error-icon">
                <Icon name="exclamation-triangle" size="sm" />
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* Botão de Pagamento */}
          <div className="checkout-actions">
            <button 
              className="btn btn-primary btn-lg btn-checkout" 
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Icon name="spinner" spin size="sm" />
                  Processando...
                </>
              ) : (
                <>
                  <Icon name="shopping-cart" size="sm" /> Pagar R$ {material.price.toFixed(2)}
                </>
              )}
            </button>
            <p className="checkout-note">
              Você será redirecionado para a página segura de pagamento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;