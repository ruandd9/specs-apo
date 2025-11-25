import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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

  if (loading) return <div className="loading">Carregando detalhes...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!material) return <div className="error">Material não encontrado</div>;

  return (
    <div className="material-detail">
      <h2>{material.title}</h2>
      
      <div className="material-info">
        <p>{material.description}</p>
        
        <div className="material-details">
          <p><strong>Páginas:</strong> {material.imageCount || 'N/A'} páginas</p>
          <p className="price"><strong>Preço:</strong> R$ {material.price.toFixed(2)}</p>
        </div>
        
        <div className="actions">
          {hasPurchased ? (
            <Link to={`/view/${id}`} className="btn btn-primary">
              Acessar Apostila
            </Link>
          ) : (
            <Link to={`/checkout/${id}`} className="btn btn-primary">
              Comprar Agora - R$ {material.price.toFixed(2)}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;