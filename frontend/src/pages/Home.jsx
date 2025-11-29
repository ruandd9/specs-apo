import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';
import Icon from '../components/Icon';

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
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-badge">
          <span className="badge-text">POR GABRIEL NOGUEIRA & MARCUS JOSÉ</span>
        </div>
        <h1 className="hero-title">
          <span className="brand-name">FÍSICA 4 VEST</span>
        </h1>
        <p className="hero-subtitle">
          Estude de forma prática e eficiente com o Física 4 Vest. 
          Nossas apostilas simplificam o conteúdo, ajudando você a se preparar 
          e alcançar a aprovação no vestibular.
        </p>
        <p className="hero-cta-text">
          Acelere seu aprendizado e conquiste seus objetivos com material completo e direto ao ponto.
        </p>
        
        {!user ? (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">Começar Agora</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Já Tenho Conta</Link>
          </div>
        ) : hasPurchased ? (
          <div className="cta-buttons">
            <Link to={`/view/${material._id}`} className="btn btn-primary btn-lg">
              <Icon name="book-open" size="sm" /> Acessar Minha Apostila
            </Link>
          </div>
        ) : material ? (
          <div className="cta-buttons">
            <Link to={`/material/${material._id}`} className="btn btn-primary btn-lg">
              Ver Apostila Disponível
            </Link>
          </div>
        ) : null}
      </div>
      
      {/* Material Showcase */}
      {material && !loading && (
        <div className="material-showcase">
          <div className="showcase-content">
            <span className="showcase-label">Apostila Disponível</span>
            <h2 className="showcase-title">{material.title}</h2>
            <p className="showcase-description">{material.description}</p>
            {!hasPurchased && (
              <div className="showcase-price">
                <span className="price-label">Investimento:</span>
                <span className="price-value">R$ {material.price.toFixed(2)}</span>
              </div>
            )}
            {!user && (
              <Link to="/register" className="btn btn-primary">
                Criar Conta para Adquirir
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Por que escolher o Fisica 4VEST?</h2>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <Icon name="book" size="2x" />
            </div>
            <h3>Estudo Organizado</h3>
            <p>Interface simples e intuitiva para organizar seu conteúdo de forma eficaz e otimizar seus estudos.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <Icon name="chalkboard-teacher" size="2x" />
            </div>
            <h3>Apoio ao Estudo em Grupo</h3>
            <p>Compartilhe materiais e tire dúvidas com colegas, criando uma rede de aprendizado colaborativa.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <Icon name="chart-line" size="2x" />
            </div>
            <h3>Acompanhamento</h3>
            <p>Acompanhe sua evolução e saiba exatamente onde focar para alcançar a aprovação no vestibular.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="cta-section">
          <h2>Pronto para Acelerar Sua Aprovação?</h2>
          <p>Junte-se aos estudantes que já estão conquistando seus objetivos com o Física 4 Vest</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Criar Minha Conta Grátis
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;