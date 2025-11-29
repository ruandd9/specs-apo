import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Icon from '../components/Icon';

const MaterialDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await api.getMaterialById(token, id);
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
  }, [id, token]);

  const hasPurchased = user && material && user.ownedMaterials?.includes(material._id);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Carregando detalhes...</p>
      </div>
    );
  }
  
  if (error) return <div className="error">{error}</div>;
  if (!material) return <div className="error">Material não encontrado</div>;

  return (
    <div className="material-detail">
      <div className="detail-card">
        {/* Header */}
        <div className="detail-header">
          <h1>{material.title}</h1>
          <p className="detail-description">{material.description}</p>
        </div>

        {/* Features */}
        <div className="detail-features-compact">
          <h3>O Que Você Vai Encontrar:</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon-small">
                <Icon name="trophy" size="lg" />
              </span>
              <div>
                <strong>Raio-X do ENEM</strong>
                <p>Entenda de forma visual os tópicos mais cobrados no ENEM.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon-small">
                <Icon name="chalkboard-teacher" size="lg" />
              </span>
              <div>
                <strong>Instrutores Preparados</strong>
                <p>Apostila feita com esmero por Autores e Revisores preparados.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon-small">
                <Icon name="book" size="lg" />
              </span>
              <div>
                <strong>Conteúdo Completo</strong>
                <p>Tudo sobre Termologia, Calorimetria, Eletromagnestismo e muito mais!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="detail-footer">
          {hasPurchased ? (
            <>
              <div className="purchased-badge-inline">
                <Icon name="check-circle" size="sm" /> Você já possui esta apostila
              </div>
              <Link to={`/view/${id}`} className="btn btn-primary btn-lg">
                <Icon name="book-open" size="sm" /> Acessar Apostila
              </Link>
            </>
          ) : (
            <>
              <div className="price-inline">
                <span className="price-label">Investimento:</span>
                <span className="price-value">R$ {material.price.toFixed(2)}</span>
              </div>
              <Link to={`/checkout/${id}`} className="btn btn-primary btn-lg">
                <Icon name="shopping-cart" size="sm" /> Comprar Agora
              </Link>
              <p className="payment-note">Pagamento seguro • Acesso imediato</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;