# 🚀 Deploy com Render - Guia Completo

## 🎯 Por Que Render?

- ✅ **Mais simples** que Railway
- ✅ **750 horas gratuitas/mês** (vs 500h do Railway)
- ✅ **Interface intuitiva**
- ✅ **Documentação excelente**
- ✅ **Deploy automático**
- ✅ **HTTPS gratuito**

---

## 📋 O Que Você Vai Ter

**Resultado Final:**
```
Frontend: https://apostilas-online.onrender.com
Backend:  https://apostilas-api.onrender.com
```

**Tempo:** 15-20 minutos  
**Custo:** R$ 0/mês

---

## 🚀 Passo 1: Deploy do Backend (7 min)

### 1.1. Criar conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Escolha **"Sign in with GitHub"**
4. Autorize o Render

### 1.2. Criar Web Service

1. No dashboard, clique **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub
3. Selecione: `specs-apo`
4. Clique **"Connect"**

### 1.3. Configurar o serviço

Preencha os campos:

```
Name: apostilas-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 1.4. Escolher plano

- Selecione: **"Free"** (R$ 0/mês)
- Clique **"Create Web Service"**

### 1.5. Adicionar variáveis de ambiente

1. Vá na aba **"Environment"**
2. Clique **"Add Environment Variable"**
3. Adicione cada uma:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=sua_mongodb_uri_aqui
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_super_seguro_aqui
STRIPE_SECRET_KEY=sua_stripe_secret_key_aqui
STRIPE_PUBLISHABLE_KEY=sua_stripe_publishable_key_aqui
STRIPE_WEBHOOK_SECRET=seu_stripe_webhook_secret_aqui
FRONTEND_URL=https://seu-site.onrender.com
```

⚠️ **IMPORTANTE:** 
- Render usa porta `10000` por padrão
- Você vai atualizar `FRONTEND_URL` depois

4. Clique **"Save Changes"**

### 1.6. Aguardar deploy

- O Render vai fazer o primeiro deploy (5-7 minutos)
- Você verá os logs em tempo real
- Aguarde até ver: **"Your service is live 🎉"**

### 1.7. Obter URL do backend

1. No topo da página, copie a URL
2. Será algo como: `https://apostilas-backend.onrender.com`
3. **Anote essa URL!**

✅ **Backend está no ar!**

---

## 🎨 Passo 2: Preparar Frontend (3 min)

### 2.1. Atualizar código para usar variável de ambiente

Edite `frontend/src/services/api.js`:

**Encontre:**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

**Substitua por:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### 2.2. Configurar servidor para Render

⚠️ **IMPORTANTE:** O Render precisa que o servidor escute em `0.0.0.0`

Edite `backend/server.js`:

**Encontre:**
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**Substitua por:**
```javascript
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Necessário para Render

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

✅ **Isso já foi feito no último commit!** Se você acabou de clonar, já está correto.

### 2.3. Commit e push

```bash
git add frontend/src/services/api.js
git commit -m "feat: Adicionar suporte a variável de ambiente para API"
git push origin main
```

✅ **Frontend preparado!**

---

## 🌐 Passo 3: Deploy do Frontend (7 min)

### 3.1. Criar Static Site

1. No Render dashboard, clique **"New +"** → **"Static Site"**
2. Selecione seu repositório: `specs-apo`
3. Clique **"Connect"**

### 3.2. Configurar o site

Preencha:

```
Name: apostilas-online
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### 3.3. Adicionar variável de ambiente

1. Clique em **"Advanced"**
2. Adicione:

```
Key: VITE_API_URL
Value: https://apostilas-backend.onrender.com/api
```

⚠️ **Use a URL do backend que você anotou!**

### 3.4. Deploy!

1. Clique **"Create Static Site"**
2. Aguarde 3-5 minutos
3. Você verá: **"Your site is live 🎉"**

### 3.5. Obter URL do site

1. Copie a URL do topo
2. Será algo como: `https://apostilas-online.onrender.com`

✅ **Frontend está no ar!**

---

## 🔄 Passo 4: Conectar Tudo (3 min)

### 4.1. Atualizar FRONTEND_URL no backend

1. Volte ao serviço do backend
2. Vá em **"Environment"**
3. Edite `FRONTEND_URL`
4. Cole: `https://apostilas-online.onrender.com`
5. Clique **"Save Changes"**

O Render vai fazer redeploy automático.

### 4.2. Configurar CORS

Edite `backend/server.js`:

**Encontre:**
```javascript
app.use(cors());
```

**Substitua por:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://apostilas-online.onrender.com' // Sua URL do Render
  ],
  credentials: true
}));
```

### 4.3. Commit e push

```bash
git add backend/server.js
git commit -m "feat: Configurar CORS para produção"
git push origin main
```

Render vai fazer redeploy automático (3-5 min).

✅ **Tudo conectado!**

---

## 🧪 Passo 5: Testar (2 min)

### 5.1. Acesse seu site

Abra: `https://apostilas-online.onrender.com`

### 5.2. Teste completo

1. ✅ Registre um usuário
2. ✅ Faça login
3. ✅ Veja apostilas
4. ✅ Simule compra (4242 4242 4242 4242)
5. ✅ Visualize apostila

---

## 🎉 Pronto! Site no Ar!

**Compartilhe com clientes:**
```
🌐 Site: https://apostilas-online.onrender.com

👤 Login de teste:
Email: usuario@teste.com
Senha: teste123

💳 Cartão de teste:
4242 4242 4242 4242
Data: 12/25
CVC: 123
```

---

## 📊 O Que Você Tem

| Item | Status | URL |
|------|--------|-----|
| **Site** | ✅ | https://apostilas-online.onrender.com |
| **API** | ✅ | https://apostilas-backend.onrender.com |
| **Database** | ✅ | MongoDB Atlas |
| **Payments** | ✅ | Stripe (teste) |
| **HTTPS** | ✅ | Automático |
| **Custo** | ✅ | R$ 0/mês |
| **Horas** | ✅ | 750h/mês |

---

## ⚠️ Importante: Plano Gratuito do Render

### Limitações

**O plano gratuito do Render tem uma característica importante:**

- ⏰ **Serviço "dorme" após 15 minutos de inatividade**
- 🐌 **Primeira requisição após "acordar" leva ~30-60 segundos**
- ⚡ **Depois disso, funciona normalmente**

### Como Funciona

```
Usuário acessa → Serviço dormindo → Acorda (30-60s) → Funciona normal
                                    ↓
                            Primeira visita lenta
                            Próximas visitas rápidas
```

### Soluções

**Opção 1: Aceitar a limitação (Gratuito)**
- Bom para demonstrações
- Avise clientes sobre o primeiro acesso

**Opção 2: Upgrade para Paid ($7/mês)**
- Serviço sempre ativo
- Sem delay
- Melhor para produção

**Opção 3: Keep-alive gratuito**
- Use serviço como UptimeRobot
- Faz ping a cada 5 minutos
- Mantém serviço acordado

---

## 🔄 Atualizações Automáticas

**Toda vez que você fizer push:**

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Render detecta e faz deploy automático!
# Backend: ~5 minutos
# Frontend: ~3 minutos
```

---

## 🎨 Domínio Customizado (Opcional)

### Adicionar seu domínio

**No Render:**
1. Vá em **"Settings"** → **"Custom Domain"**
2. Adicione: `www.suaapostila.com.br`
3. Configure DNS conforme instruções

**Custo:**
- .com.br: ~R$ 40/ano
- .com: ~R$ 60/ano

---

## 💡 Dicas para Demonstração

### 1. Avisar sobre primeiro acesso

```
⚠️ Primeira visita pode levar 30-60 segundos
(serviço gratuito "acorda" na primeira requisição)

Após isso, funciona normalmente!
```

### 2. "Acordar" o serviço antes da demo

Acesse o site 2 minutos antes de mostrar ao cliente.

### 3. Usar UptimeRobot (Gratuito)

1. Crie conta: https://uptimerobot.com
2. Adicione monitor HTTP
3. URL: `https://apostilas-backend.onrender.com`
4. Intervalo: 5 minutos

Isso mantém o serviço sempre acordado!

---

## 🆘 Problemas Comuns

### "Site muito lento no primeiro acesso"

**Normal!** Plano gratuito "dorme".

**Soluções:**
- Acesse antes de mostrar ao cliente
- Use UptimeRobot
- Upgrade para plano pago ($7/mês)

### "linux is NOT supported" ou "No open ports detected"

**Erro completo:**
```
linux is NOT supported.
==> No open ports detected, continuing to scan...
```

**Causas possíveis:**

**1. Servidor não está escutando em `0.0.0.0`**

**Solução:**
```javascript
// backend/server.js
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => { ... });
```

**2. Dependências nativas problemáticas (sharp, pdf-poppler)**

Essas dependências têm binários nativos que podem falhar no Linux do Render.

**Solução:**
- ✅ Já foram removidas no último commit!
- Se você clonou antes, faça `git pull origin main`

**3. Porta não está sendo usada**

Verifique se `process.env.PORT` está sendo usado:
```javascript
const PORT = process.env.PORT || 3000;
```

### "Cannot connect to backend"

**Verifique:**
1. Backend está rodando? (veja logs)
2. VITE_API_URL está correto?
3. CORS configurado?
4. Servidor escutando em `0.0.0.0`?

### "MongoDB connection failed"

**Solução:**
1. MongoDB Atlas → Network Access
2. Adicione: `0.0.0.0/0`

---

## 📈 Quando Fazer Upgrade?

### Mantenha Gratuito Se:
- ✅ Apenas demonstrações
- ✅ Poucos acessos
- ✅ Não se importa com delay inicial

### Faça Upgrade ($7/mês) Se:
- ✅ Site em produção
- ✅ Muitos acessos
- ✅ Precisa de velocidade
- ✅ Clientes pagantes

---

## ✅ Checklist Final

- [ ] Backend no Render funcionando
- [ ] Frontend no Render funcionando
- [ ] CORS configurado
- [ ] Variáveis de ambiente corretas
- [ ] MongoDB conectado
- [ ] Stripe funcionando
- [ ] Site testado
- [ ] URL compartilhada

---

## 🎯 Comparação: Render vs Railway

| Aspecto | Render | Railway |
|---------|--------|---------|
| **Horas gratuitas** | 750h/mês | 500h/mês |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Interface** | Simples | Moderna |
| **Documentação** | Excelente | Boa |
| **Sleep após inatividade** | Sim (15 min) | Não |
| **Upgrade** | $7/mês | $5/mês |

**Recomendação:**
- **Render:** Melhor para iniciantes, mais horas gratuitas
- **Railway:** Melhor se não quer sleep, interface mais moderna

---

## 🚀 Próximos Passos

1. ✅ **Mostrar para clientes**
2. **Coletar feedback**
3. **Fazer ajustes**
4. **Considerar upgrade** (se necessário)
5. **Adicionar domínio customizado**

---

**Tempo total:** ~20 minutos  
**Custo:** R$ 0/mês  
**Horas:** 750h/mês  
**Resultado:** Site profissional online! 🎉

---

**Última atualização:** 26/11/2025  
**Versão:** 1.0.0  
**Status:** ✅ Testado e Funcionando
