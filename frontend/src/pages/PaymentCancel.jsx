import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-result cancel">
      <div className="result-container">
        <div className="icon">❌</div>
        <h2>Pagamento Cancelado</h2>
        <p>Você cancelou o processo de pagamento.</p>
        <p>Não se preocupe, nenhuma cobrança foi realizada.</p>
        <div className="actions">
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
          >
            Voltar para Início
          </button>
          <button 
            onClick={() => navigate(-2)} 
            className="btn btn-secondary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
