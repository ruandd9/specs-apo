import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await api.getUserPurchases(token);
        setPurchases(data);
      } catch (err) {
        setError(err.message || 'Falha ao carregar compras');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPurchases();
    }
  }, [token]);

  return (
    <div className="dashboard">
      <h2>Minha Conta</h2>
      
      <div className="user-info">
        <p><strong>Nome:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
      
      <div className="dashboard-section">
        <h3>Minhas Apostilas</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <p>Carregando...</p>
        ) : purchases.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não possui nenhuma apostila.</p>
            <Link to="/" className="btn btn-primary">Ver Apostilas Disponíveis</Link>
          </div>
        ) : (
          <div className="materials-grid">
            {purchases.map(purchase => (
              <div key={purchase._id} className="material-card">
                <h4>{purchase.material.title}</h4>
                <p>{purchase.material.description}</p>
                <p className="purchase-date">
                  Comprado em: {new Date(purchase.createdAt).toLocaleDateString('pt-BR')}
                </p>
                <Link 
                  to={`/view/${purchase.material._id}`} 
                  className="btn btn-primary"
                >
                  Acessar Apostila
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;