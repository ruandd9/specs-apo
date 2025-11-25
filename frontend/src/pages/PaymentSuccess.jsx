import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Redirecionar para dashboard após 3 segundos
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
