# 📚 Sistema de Apostilas Online

Uma plataforma completa para venda e visualização segura de materiais de estudo digitais com integração de pagamento Stripe.

[![Status](https://img.shields.io/badge/status-MVP%20Funcional-success)](./docs/desenvolvimento/STATUS_ATUAL.md)
[![Versão](https://img.shields.io/badge/versão-1.0.0-blue)](./docs/RESUMO_FINAL.md)
[![Documentação](https://img.shields.io/badge/docs-completa-brightgreen)](./docs/README.md)

---

## 🎯 Visão Geral

Sistema web completo que permite usuários comprarem e visualizarem apostilas digitais de forma segura, com proteção contra cópia e download não autorizado.

### ✨ Funcionalidades Principais

- ✅ **Autenticação Completa** - Registro, login e proteção de rotas
- ✅ **Sistema de Pagamento** - Integração com Stripe
- ✅ **Visualizador PDF** - Visualização segura com watermark dinâmico
- ✅ **Painel Administrativo** - Gerenciamento de usuários e materiais
- ✅ **Interface em Português** - 100% traduzida

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js (v16+)
- MongoDB (Atlas ou local)
- Conta Stripe (modo teste)

### Instalação em 3 Passos

1. **Clone e instale dependências:**
   ```bash
   git clone https://github.com/ruandd9/specs-apo.git
   cd apo
   
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure o ambiente:**
   ```bash
   # Backend: copie e configure o .env
   cd backend
   copy .env.example .env
   # Edite .env com suas configurações
   
   # Inicialize o banco de dados
   npm run seed
   ```

3. **Inicie o sistema:**
   ```bash
   # Use o script automático (Windows)
   start-dev.bat
   
   # Ou manualmente:
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

**Acesse:** http://localhost:3003

---

## 📖 Documentação Completa

Toda a documentação está organizada na pasta **[`docs/`](./docs/README.md)**

### 📚 Documentos Principais

| Documento | Descrição |
|-----------|-----------|
| **[RESUMO_FINAL.md](./docs/RESUMO_FINAL.md)** | Visão geral completa do projeto |
| **[docs/README.md](./docs/README.md)** | Índice de toda documentação |

### ⚙️ Setup e Configuração

| Documento | Descrição |
|-----------|-----------|
| **[INSTALACAO_MONGODB.md](./docs/setup/INSTALACAO_MONGODB.md)** | Como instalar e configurar MongoDB |
| **[COMO_CONFIGURAR_STRIPE.md](./docs/setup/COMO_CONFIGURAR_STRIPE.md)** | Guia rápido do Stripe (5 min) |
| **[CONFIGURAR_STRIPE.md](./docs/setup/CONFIGURAR_STRIPE.md)** | Guia completo do Stripe |

### 📘 Guias

| Documento | Descrição |
|-----------|-----------|
| **[STRIPE_PRODUCAO.md](./docs/guias/STRIPE_PRODUCAO.md)** | Como receber pagamentos reais |

### 🛠️ Desenvolvimento

| Documento | Descrição |
|-----------|-----------|
| **[CORRECOES.md](./docs/desenvolvimento/CORRECOES.md)** | Histórico de correções |
| **[ROADMAP.md](./docs/desenvolvimento/ROADMAP.md)** | Funcionalidades futuras |
| **[STATUS_ATUAL.md](./docs/desenvolvimento/STATUS_ATUAL.md)** | Status do sistema |

---

## 🏗️ Estrutura do Projeto

```
apo/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── models/            # Modelos MongoDB
│   │   ├── routes/            # Rotas da API
│   │   ├── middleware/        # Autenticação, etc
│   │   ├── services/          # Serviços externos
│   │   └── scripts/           # Scripts de gerenciamento
│   ├── uploads/               # PDFs e imagens
│   └── server.js              # Entry point
│
├── frontend/                   # App React + Vite
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas
│   │   ├── contexts/          # Context API
│   │   ├── services/          # API client
│   │   └── hooks/             # Custom hooks
│   └── index.html
│
├── docs/                       # 📚 Documentação
│   ├── setup/                 # Guias de configuração
│   ├── guias/                 # Guias específicos
│   └── desenvolvimento/       # Docs técnicas
│
└── specs-apo/                  # Especificações
```

---

## 🔑 Credenciais de Teste

### Usuários

**Admin:**
- Email: `admin@apostilas.com`
- Senha: `admin123`

**Usuário Comum:**
- Email: `usuario@teste.com`
- Senha: `teste123`

### Cartão de Teste Stripe

- **Número:** `4242 4242 4242 4242`
- **Data:** `12/25` (qualquer data futura)
- **CVC:** `123` (qualquer 3 dígitos)
- **CEP:** Qualquer

---

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (autenticação)
- Stripe (pagamentos)
- PDF.js (visualização)
- Swagger (documentação)

### Frontend
- React 18
- React Router v6
- Vite
- PDF.js
- CSS3

---

## 📊 Status do Projeto

### ✅ Implementado e Funcionando

- ✅ Autenticação completa (JWT)
- ✅ Sistema de pagamento (Stripe)
- ✅ Visualizador PDF com watermark
- ✅ Painel administrativo
- ✅ Gerenciamento de usuários
- ✅ Gerenciamento de materiais
- ✅ Interface em português
- ✅ Proteção de conteúdo

### 🔄 Próximas Funcionalidades

Veja o **[ROADMAP.md](./docs/desenvolvimento/ROADMAP.md)** para lista completa:

- Sistema de cupons de desconto
- Recuperação de senha
- Notificações por email
- Sistema de avaliações
- Categorias de apostilas
- Dashboard de vendas

---

## 🚀 Deploy

### Backend
Pode ser deployado em:
- Railway
- Render
- Heroku
- DigitalOcean

### Frontend
Pode ser deployado em:
- Vercel
- Netlify
- GitHub Pages

**Veja:** [STRIPE_PRODUCAO.md](./docs/guias/STRIPE_PRODUCAO.md) para configurar pagamentos reais.

---

## 🔒 Segurança

- ✅ Senhas hasheadas (bcrypt)
- ✅ JWT tokens com expiração
- ✅ Proteção de rotas
- ✅ Watermark dinâmico
- ✅ Validação de dados
- ✅ Integração segura com Stripe

---

## 📝 Scripts Úteis

### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento (nodemon)
npm run seed       # Inicializar banco de dados
```

### Frontend
```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
```

### Gerenciamento
```bash
# Adicionar material
node backend/src/scripts/addMaterial.js

# Verificar materiais
node backend/src/scripts/checkMaterials.js
```

---

## 🆘 Problemas Comuns

### Backend não inicia
- **Causa:** MongoDB não configurado
- **Solução:** [INSTALACAO_MONGODB.md](./docs/setup/INSTALACAO_MONGODB.md)

### Erro "Invalid API Key"
- **Causa:** Stripe não configurado
- **Solução:** [COMO_CONFIGURAR_STRIPE.md](./docs/setup/COMO_CONFIGURAR_STRIPE.md)

### Apostila não aparece após compra
- **Causa:** Webhook não configurado (normal em teste)
- **Solução:** Sistema verifica automaticamente na página de sucesso

---

## 📞 Suporte

- **Documentação:** [docs/README.md](./docs/README.md)
- **Issues:** [GitHub Issues](https://github.com/ruandd9/specs-apo/issues)
- **Email:** [seu-email@exemplo.com]

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🎉 Agradecimentos

- Stripe pela excelente API de pagamentos
- MongoDB Atlas pelo banco de dados gratuito
- Comunidade React e Node.js

---

**Desenvolvido com ❤️ por [Seu Nome]**

**Última atualização:** 25/11/2025  
**Versão:** 1.0.0  
**Status:** ✅ MVP Completo e Funcional
