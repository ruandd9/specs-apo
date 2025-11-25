# Plano de Implementação - Sistema de Apostilas Online (Simplificado)

- [x] 1. Configurar estrutura base do projeto
  - Criar pasta backend com Node.js/Express simples
  - Criar pasta frontend com React básico
  - Configurar package.json com dependências mínimas
  - Criar arquivos .env para configurações
  - _Requisitos: Base para todos os requisitos_

- [x] 2. Configurar MongoDB e modelos



  - Instalar MongoDB localmente ou usar MongoDB Atlas (gratuito)
  - Configurar Mongoose para conexão com banco
  - Criar modelos User, Apostila e Purchase
  - Testar conexão com banco de dados
  - _Requisitos: 1.2, 2.1, 3.3, 5.2_

- [x] 3. Implementar autenticação simples no backend



  - Criar modelo User com Mongoose
  - Implementar hash de senhas com bcrypt
  - Criar rota de registro POST /auth/register
  - Criar rota de login POST /auth/login com express-session
  - Implementar middleware de verificação de sessão
  - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 4. Implementar CRUD de apostilas no backend
  - Criar modelo Apostila com Mongoose
  - Implementar rota GET /apostilas (listar todas)
  - Implementar rota GET /apostilas/:id (detalhes)
  - Implementar upload de arquivos com multer
  - Criar rotas admin para CRUD completo
  - _Requisitos: 2.1, 2.2, 5.2, 5.3, 5.4_

- [ ] 5. Implementar sistema de compras simulado
  - Criar modelo Purchase com Mongoose
  - Implementar rota POST /purchase (simula pagamento)
  - Sempre aprovar compras para desenvolvimento
  - Registrar compra no banco com status 'completed'
  - Implementar verificação de compras duplicadas
  - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.6_

- [ ] 6. Implementar controle de acesso ao conteúdo
  - Criar middleware para verificar se usuário comprou apostila
  - Implementar rota GET /content/:id para servir arquivos
  - Verificar sessão e compra antes de servir arquivo
  - Retornar erro 403 se não tiver acesso
  - _Requisitos: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Criar estrutura base do frontend React
  - Configurar Create React App (JavaScript simples)
  - Instalar React Router e Axios
  - Criar componentes básicos de layout (Header, Footer)
  - Configurar Bootstrap ou CSS simples para estilização
  - _Requisitos: Base para requisitos de interface_

- [ ] 8. Implementar páginas de autenticação frontend
  - Criar página de registro com formulário simples
  - Criar página de login com formulário simples
  - Implementar Context API para gerenciar estado do usuário
  - Criar componente ProtectedRoute para rotas privadas
  - _Requisitos: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 9. Implementar catálogo de apostilas frontend
  - Criar página de listagem de apostilas
  - Implementar cards simples para cada apostila
  - Criar página de detalhes da apostila
  - Mostrar botão "Comprar" ou "Acessar" baseado no status
  - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 10. Implementar sistema de compras frontend
  - Criar página de confirmação de compra
  - Implementar botão "Comprar Agora" que chama API
  - Mostrar mensagem de sucesso após compra
  - Redirecionar para visualização da apostila
  - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 11. Implementar visualização de conteúdo frontend
  - Criar página para visualizar apostila comprada
  - Implementar visualizador de PDF simples (iframe ou embed)
  - Verificar acesso antes de mostrar conteúdo
  - Criar página de "Acesso Negado" para não compradores
  - _Requisitos: 4.1, 4.2, 4.3, 4.4_

- [ ] 12. Implementar painel administrativo
  - Criar página de admin com lista de apostilas
  - Implementar formulário para cadastrar nova apostila
  - Implementar upload de arquivo PDF
  - Criar página para ver todas as compras realizadas
  - Adicionar verificação de role 'admin'
  - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 13. Implementar melhorias de UX
  - Adicionar loading states nos botões
  - Implementar mensagens de erro e sucesso
  - Criar página 404 para rotas não encontradas
  - Adicionar validação básica nos formulários
  - _Requisitos: Melhoria da experiência do usuário_

- [ ] 14. Testes e finalização
  - Testar todos os fluxos manualmente
  - Corrigir bugs encontrados
  - Criar usuário admin inicial
  - Adicionar algumas apostilas de exemplo
  - Documentar como executar o projeto
  - _Requisitos: Validação final de todos os requisitos_