import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, user } = useAuth();
  const sessionId = searchParams.get('session_id');
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !token) {
        setError('Sessão inválida');
        setVerifying(false);
        return;
      }

      try {
        console.log('🔍 Verificando pagamento:', sessionId);
        await api.verifyPaymentSuccess(token, sessionId);
        console.log('✅ Pagamento verificado com sucesso');
        setVerifying(false);
        
        // Redirecionar para dashboard após 3 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (err) {
        console.error('❌ Erro ao verificar pagamento:', err);
        setError(err.message || 'Erro ao verificar pagamento');
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, token, navigate]);

  if (verifying) {
    return (
      <div className="payment-result success">
        <div className="result-container">
          <div className="icon">⏳</div>
          <h2>Verificando Pagamento...</h2>
          <p>Aguarde enquanto confirmamos sua compra.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-result error">
        <div className="result-container">
          <div className="icon">❌</div>
          <h2>Erro ao Verificar Pagamento</h2>
          <p>{error}</p>
          <div className="actions">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-primary"
            >
              Ir para Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result success">
      <div className="result-container">
        <div className="icon">✅</div>
        <h2>Pagamento Realizado com Sucesso!</h2>
        <p>Sua compra foi processada e você já pode acessar sua apostila.</p>
        <p className="session-id">ID da Transação: {sessionId}</p>
        <div className="actions">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-primary"
          >
            Ir para Minhas Apostilas
          </button>
        </div>
        <p className="redirect-note">Você será redirecionado automaticamente em 3 segundos...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
