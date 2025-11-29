import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Icon from '../components/Icon';

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
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Minha Conta</h1>
          <p className="header-subtitle">Bem-vindo de volta, {user?.name}!</p>
        </div>
      </div>
      
      {/* User Info Card */}
      <div className="user-info-card">
        <div className="info-icon">
          <Icon name="user" size="lg" />
        </div>
        <div className="info-content">
          <div className="info-item">
            <Icon name="user" size="sm" />
            <span className="info-label">Nome:</span>
            <span className="info-value">{user?.name}</span>
          </div>
          <div className="info-item">
            <Icon name="envelope" size="sm" />
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
        </div>
      </div>
      
      {/* Materials Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            <Icon name="book" /> Minhas Apostilas
          </h2>
          <span className="materials-count">
            {purchases.length} {purchases.length === 1 ? 'apostila' : 'apostilas'}
          </span>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando suas apostilas...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="book-open" size="3x" />
            </div>
            <h3>Nenhuma apostila ainda</h3>
            <p>Você ainda não possui nenhuma apostila. Comece agora sua jornada rumo à aprovação!</p>
            <Link to="/" className="btn btn-primary btn-lg">
              <Icon name="rocket" size="sm" /> Explorar Apostilas Disponíveis
            </Link>
          </div>
        ) : (
          <div className="materials-grid">
            {purchases.map(purchase => (
              <div key={purchase._id} className="material-card purchased">
                <div className="card-badge">
                  <Icon name="check-circle" size="sm" /> Adquirida
                </div>
                <div className="card-content">
                  <h3>{purchase.material.title}</h3>
                  <p className="card-description">{purchase.material.description}</p>
                  <div className="card-footer">
                    <span className="purchase-date">
                      <Icon name="calendar" size="sm" /> {new Date(purchase.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <Link 
                      to={`/view/${purchase.material._id}`} 
                      className="btn btn-primary"
                    >
                      Acessar Apostila →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;