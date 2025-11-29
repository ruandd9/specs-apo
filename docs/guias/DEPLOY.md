# 🚀 Guia de Deploy - Sistema de Apostilas Online

## ⚠️ Importante: GitHub Pages NÃO Funciona

**GitHub Pages só serve arquivos estáticos.** Seu projeto precisa de:
- ❌ Backend Node.js (não suportado)
- ❌ MongoDB (não suportado)
- ❌ Processamento de pagamentos (não suportado)

**Solução:** Hospedar frontend e backend separadamente.

---

## 🎯 Arquitetura de Deploy Recomendada

```
┌─────────────────┐
│   Usuário       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │  ← Vercel/Netlify (Gratuito)
│  (React)        │     https://seu-site.vercel.app
└────────┬────────┘
         │ API calls
         ▼
┌─────────────────┐
│  Backend        │  ← Railway/Render (Gratuito)
│  (Node.js)      │     https://api-seu-site.railway.app
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB Atlas  │  ← Já configurado! (Gratuito)
│  (Database)     │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Stripe         │  ← Pagamentos
│  (Payments)     │
└─────────────────┘
```

---

## 📦 Opção 1: Vercel (Frontend) + Railway (Backend)

### ✅ Vantagens
- Gratuito para começar
- Deploy automático do GitHub
- SSL/HTTPS incluído
- Fácil configuração

### 🔧 Passo a Passo

#### 1. Deploy do Backend (Railway)

**1.1. Criar conta no Railway:**
- Acesse: https://railway.app
- Faça login com GitHub

**1.2. Criar novo projeto:**
```bash
# No Railway Dashboard:
1. Click "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha seu repositório
4. Selecione a pasta "backend"
```

**1.3. Configurar variáveis de ambiente:**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=sua_string_mongodb_atlas
JWT_SECRET=seu_jwt_secret_seguro
JWT_REFRESH_SECRET=seu_refresh_secret_seguro
STRIPE_SECRET_KEY=sk_live_sua_chave_producao
STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_producao
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
FRONTEND_URL=https://seu-site.vercel.app
```

**1.4. Deploy:**
- Railway faz deploy automático
- Anote a URL: `https://seu-backend.railway.app`

#### 2. Deploy do Frontend (Vercel)

**2.1. Criar conta no Vercel:**
- Acesse: https://vercel.com
- Faça login com GitHub

**2.2. Importar projeto:**
```bash
# No Vercel Dashboard:
1. Click "Add New Project"
2. Import seu repositório
3. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
```

**2.3. Configurar variável de ambiente:**
```env
VITE_API_URL=https://seu-backend.railway.app/api
```

**2.4. Atualizar frontend para usar variável:**

Edite `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

**2.5. Deploy:**
- Vercel faz deploy automático
- Seu site estará em: `https://seu-site.vercel.app`

#### 3. Configurar CORS no Backend

Edite `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://seu-site.vercel.app'
  ],
  credentials: true
}));
```

#### 4. Atualizar Stripe

No Dashboard do Stripe:
- Webhook URL: `https://seu-backend.railway.app/api/purchases/webhook`
- Success URL: `https://seu-site.vercel.app/success`
- Cancel URL: `https://seu-site.vercel.app/cancel`

---

## 📦 Opção 2: Netlify (Frontend) + Render (Backend)

### Render (Backend)

**1. Criar conta:**
- https://render.com

**2. Novo Web Service:**
```bash
1. Connect GitHub repository
2. Name: apostilas-backend
3. Environment: Node
4. Build Command: npm install
5. Start Command: npm start
6. Plan: Free
```

**3. Variáveis de ambiente:**
- Adicione as mesmas do Railway

### Netlify (Frontend)

**1. Criar conta:**
- https://netlify.com

**2. Novo site:**
```bash
1. Import from Git
2. Build command: npm run build
3. Publish directory: dist
4. Base directory: frontend
```

**3. Variável de ambiente:**
```env
VITE_API_URL=https://seu-backend.onrender.com/api
```

---

## 📦 Opção 3: Tudo no Render

Você pode hospedar frontend e backend no Render:

**Backend:** Web Service (como acima)
**Frontend:** Static Site

---

## 🔒 Checklist de Segurança para Produção

Antes de fazer deploy:

### Backend
- [ ] Trocar JWT_SECRET para valor seguro
- [ ] Usar chaves Stripe de produção (`sk_live_...`)
- [ ] Configurar CORS corretamente
- [ ] Remover logs de debug
- [ ] Configurar rate limiting
- [ ] Habilitar HTTPS

### Frontend
- [ ] Atualizar API_URL para produção
- [ ] Remover console.logs
- [ ] Testar build de produção localmente
- [ ] Verificar variáveis de ambiente

### Banco de Dados
- [ ] Backup configurado
- [ ] IP whitelist configurado (ou 0.0.0.0/0 para qualquer)
- [ ] Senha forte

### Stripe
- [ ] Webhook configurado
- [ ] URLs de sucesso/cancelamento corretas
- [ ] Chaves de produção ativas

---

## 🧪 Testar Localmente Antes do Deploy

```bash
# Build do frontend
cd frontend
npm run build
npm run preview

# Testar backend em modo produção
cd backend
NODE_ENV=production npm start
```

---

## 📊 Custos Estimados

### Opção Gratuita (Recomendada para Começar)

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | R$ 0 |
| Railway | Free | R$ 0 (500h/mês) |
| MongoDB Atlas | Free | R$ 0 (512MB) |
| Stripe | Pay-as-you-go | Taxa por transação |
| **Total** | | **R$ 0/mês** |

**Limitações:**
- Railway: 500 horas/mês (suficiente para começar)
- MongoDB: 512MB storage
- Vercel: 100GB bandwidth

### Opção Paga (Para Escalar)

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Pro | R$ 100/mês |
| Railway | Hobby | R$ 25/mês |
| MongoDB Atlas | M10 | R$ 300/mês |
| **Total** | | **~R$ 425/mês** |

---

## 🚀 Deploy Automático (CI/CD)

### Configurar Deploy Automático

**Vercel e Railway fazem deploy automático quando você:**
1. Faz push para `main`
2. Merge um Pull Request
3. Cria uma tag

**Workflow:**
```bash
# Desenvolvimento
git checkout -b feature/nova-funcionalidade
# ... desenvolver ...
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade

# Criar PR no GitHub
# Após aprovação, merge para main

# Deploy automático acontece!
```

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to backend"

**Causa:** CORS ou URL incorreta

**Solução:**
1. Verifique VITE_API_URL no frontend
2. Verifique CORS no backend
3. Teste a URL do backend diretamente

### Erro: "MongoDB connection failed"

**Causa:** IP não está na whitelist

**Solução:**
1. MongoDB Atlas → Network Access
2. Adicione IP do Railway/Render
3. Ou use 0.0.0.0/0 (qualquer IP)

### Erro: "Stripe webhook failed"

**Causa:** URL do webhook incorreta

**Solução:**
1. Stripe Dashboard → Webhooks
2. Atualize URL para produção
3. Copie novo signing secret
4. Atualize STRIPE_WEBHOOK_SECRET

---

## 📝 Comandos Úteis

### Build Local
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend (teste)
cd backend
npm start
```

### Logs de Produção
```bash
# Railway
railway logs

# Render
# Ver no dashboard

# Vercel
vercel logs
```

---

## 🎯 Próximos Passos Após Deploy

1. **Configurar domínio customizado**
   - Comprar domínio (ex: suaapostila.com.br)
   - Configurar DNS no Vercel/Netlify

2. **Monitoramento**
   - Configurar Sentry para erros
   - Google Analytics para métricas

3. **Backup**
   - Configurar backup automático do MongoDB
   - Backup de uploads (PDFs)

4. **Performance**
   - CDN para assets estáticos
   - Compressão de imagens
   - Cache de API

---

## 📚 Recursos Adicionais

### Documentação Oficial
- **Vercel:** https://vercel.com/docs
- **Railway:** https://docs.railway.app
- **Render:** https://render.com/docs
- **Netlify:** https://docs.netlify.com

### Tutoriais
- Deploy Node.js no Railway: https://docs.railway.app/deploy/deployments
- Deploy React no Vercel: https://vercel.com/guides/deploying-react-with-vercel

---

## ✅ Resumo

**Não use GitHub Pages** - ele não suporta backend.

**Use:**
- **Frontend:** Vercel ou Netlify (gratuito)
- **Backend:** Railway ou Render (gratuito para começar)
- **Database:** MongoDB Atlas (já configurado)

**Custo inicial:** R$ 0/mês

**Quando escalar:** Upgrade conforme necessário

---

**Última atualização:** 26/11/2025  
**Versão:** 1.0.0  
**Status:** ✅ Guia Completo
