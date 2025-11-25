import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('materials');
  const [materials, setMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados baseado na aba ativa
        if (activeTab === 'materials') {
          const materialsData = await api.getMaterials(token, 1, 50);
          setMaterials(materialsData.materials || []);
        } else if (activeTab === 'users') {
          const usersData = await api.getAllUsers(token, 1, 50);
          setUsers(usersData.users || []);
        } else if (activeTab === 'logs') {
          const logsData = await api.getAllLogs(token, 1, 50);
          setLogs(logsData.logs || []);
        }
      } catch (err) {
        setError(err.message || 'Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [activeTab, token]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      // TODO: Implementar toggle de status do usuário
      alert('Funcionalidade em desenvolvimento');
    } catch (err) {
      alert('Erro ao atualizar usuário');
    }
  };

  const handleToggleMaterialStatus = async (materialId, currentStatus) => {
    try {
      // TODO: Implementar toggle de status do material
      alert('Funcionalidade em desenvolvimento');
    } catch (err) {
      alert('Erro ao atualizar material');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!confirm('Tem certeza que deseja excluir este material?')) return;
    
    try {
      // TODO: Implementar exclusão de material
      alert('Funcionalidade em desenvolvimento');
    } catch (err) {
      alert('Erro ao excluir material');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Painel Administrativo</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materiais
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Usuários
        </button>
        <button 
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Logs
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'materials' && (
          <div className="tab-content">
            <h3>Gerenciar Materiais</h3>
            <p className="info-text">📝 Para adicionar novos materiais, use a API ou ferramenta de upload</p>
            
            {loading ? (
              <p>Carregando materiais...</p>
            ) : materials.length === 0 ? (
              <p>Nenhum material cadastrado ainda.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Preço</th>
                    <th>Páginas</th>
                    <th>Status</th>
                    <th>Criado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(material => (
                    <tr key={material._id}>
                      <td>{material.title}</td>
                      <td>R$ {material.price.toFixed(2)}</td>
                      <td>{material.imageCount || 'N/A'}</td>
                      <td>
                        <span className={`status ${material.isActive ? 'active' : 'inactive'}`}>
                          {material.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>{new Date(material.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning mr-1"
                          onClick={() => handleToggleMaterialStatus(material._id, material.isActive)}
                        >
                          {material.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteMaterial(material._id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="tab-content">
            <h3>Gerenciar Usuários</h3>
            
            {loading ? (
              <p>Carregando usuários...</p>
            ) : users.length === 0 ? (
              <p>Nenhum usuário encontrado.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Função</th>
                    <th>Status</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role ${user.role}`}>
                          {user.role === 'admin' ? 'Admin' : 'Usuário'}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                        >
                          {user.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div className="tab-content">
            <h3>Logs do Sistema</h3>
            
            {loading ? (
              <p>Carregando logs...</p>
            ) : logs.length === 0 ? (
              <p>Nenhum log registrado ainda.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Usuário</th>
                    <th>Detalhes</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log._id}>
                      <td>
                        <span className={`log-action ${log.action}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>{log.user?.name || 'N/A'}</td>
                      <td>{log.details || 'N/A'}</td>
                      <td>{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;