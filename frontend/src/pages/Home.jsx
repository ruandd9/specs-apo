import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Home = () => {
  const { user, token } = useAuth();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        if (token) {
          const response = await api.getMaterials(token, 1, 1);
          if (response.materials && response.materials.length > 0) {
            setMaterial(response.materials[0]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar material:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [token]);

  const hasPurchased = user && material && user.ownedMaterials?.includes(material._id);

  return (
    <div className="home">
      <div className="hero">
        <h1>Apostilas Online</h1>
        <p>Sua plataforma para estudar com material digital de qualidade</p>
        
        {!user ? (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Criar Conta</Link>
            <Link to="/login" className="btn btn-secondary">Entrar</Link>
          </div>
        ) : hasPurchased ? (
          <div className="cta-buttons">
            <Link to={`/view/${material._id}`} className="btn btn-primary">Acessar Apostila</Link>
          </div>
        ) : material ? (
          <div className="cta-buttons">
            <Link to={`/material/${material._id}`} className="btn btn-primary">Ver Detalhes</Link>
          </div>
        ) : null}
      </div>
      
      {material && !loading && (
        <div className="material-showcase">
          <h2>{material.title}</h2>
          <p>{material.description}</p>
          {!hasPurchased && (
            <p className="price">R$ {material.price.toFixed(2)}</p>
          )}
        </div>
      )}
      
      <div className="features">
        <div className="feature">
          <h3>📚 Conteúdo Completo</h3>
          <p>Material de estudo completo e atualizado</p>
        </div>
        <div className="feature">
          <h3>🔒 Visualização Segura</h3>
          <p>Acesse online com proteção contra cópia não autorizada</p>
        </div>
        <div className="feature">
          <h3>💰 Preço Justo</h3>
          <p>Investimento acessível em educação de qualidade</p>
        </div>
      </div>
    </div>
  );
};

export default Home;