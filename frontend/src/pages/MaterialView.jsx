import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import PdfViewer from '../components/PdfViewer';

const MaterialView = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await api.viewMaterial(token, id);
        setMaterial(data.material);
      } catch (err) {
        if (err.message.includes('403') || err.message.includes('access')) {
          setError('Você não tem permissão para acessar este material. Compre-o primeiro!');
        } else {
          setError(err.message || 'Falha ao carregar material');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMaterial();
    }
  }, [id, token]);

  if (loading) {
    return <div className="loading">Carregando apostila...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erro ao Carregar</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Voltar para Dashboard
        </button>
      </div>
    );
  }

  if (!material) {
    return <div className="error">Material não disponível</div>;
  }

  // Usar variável de ambiente ou fallback para localhost
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
  const pdfUrl = `${API_BASE_URL}${material.pdfUrl}?token=${token}`;

  return (
    <PdfViewer
      pdfUrl={pdfUrl}
      watermarkText={material.watermark}
      title={material.title}
    />
  );
};

export default MaterialView;