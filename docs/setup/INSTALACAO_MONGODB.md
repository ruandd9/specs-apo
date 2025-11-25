# 🗄️ Instalação e Configuração do MongoDB

O backend do projeto precisa do MongoDB para funcionar. Você tem duas opções:

## Opção 1: MongoDB Atlas (Cloud - Recomendado) ☁️

**Vantagens:**
- ✅ Gratuito até 512MB
- ✅ Não precisa instalar nada
- ✅ Funciona de qualquer lugar
- ✅ Backup automático

### Passos:

1. **Criar conta no MongoDB Atlas:**
   - Acesse: https://www.mongodb.com/cloud/atlas/register
   - Crie uma conta gratuita

2. **Criar um Cluster:**
   - Clique em "Build a Database"
   - Escolha "FREE" (M0 Sandbox)
   - Escolha a região mais próxima (ex: São Paulo)
   - Clique em "Create"

3. **Configurar Acesso:**
   - **Username/Password:** Crie um usuário (ex: `admin` / `senha123`)
   - **IP Whitelist:** Adicione `0.0.0.0/0` (permite acesso de qualquer IP)
   - Clique em "Finish and Close"

4. **Obter String de Conexão:**
   - Clique em "Connect"
   - Escolha "Connect your application"
   - Copie a string de conexão (parecida com):
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Substitua `<password>` pela sua senha

5. **Atualizar o arquivo `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://admin:senha123@cluster0.xxxxx.mongodb.net/apostilas?retryWrites=true&w=majority
   ```

## Opção 2: MongoDB Local (Windows) 💻

**Vantagens:**
- ✅ Funciona offline
- ✅ Mais rápido (local)

### Passos:

1. **Baixar MongoDB:**
   - Acesse: https://www.mongodb.com/try/download/community
   - Baixe a versão para Windows
   - Execute o instalador

2. **Instalar:**
   - Escolha "Complete" installation
   - Marque "Install MongoDB as a Service"
   - Marque "Install MongoDB Compass" (interface gráfica)
   - Clique em "Install"

3. **Verificar Instalação:**
   ```bash
   mongod --version
   ```

4. **Iniciar MongoDB:**
   - O MongoDB deve iniciar automaticamente como serviço
   - Ou execute manualmente:
     ```bash
     mongod
     ```

5. **Configurar `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/apostilas
   ```

## 🧪 Testar Conexão

Depois de configurar, teste a conexão:

```bash
cd backend
npm run seed
```

Se funcionar, você verá:
```
✅ Conectado ao MongoDB
✅ Usuário admin criado
✅ Usuário teste criado
```

## ❌ Problemas Comuns

### Erro: "MongooseServerSelectionError"
**Causa:** MongoDB não está rodando ou string de conexão incorreta

**Solução:**
- **Atlas:** Verifique se o IP está liberado (0.0.0.0/0)
- **Local:** Inicie o serviço MongoDB
  ```bash
  net start MongoDB
  ```

### Erro: "Authentication failed"
**Causa:** Usuário/senha incorretos

**Solução:**
- Verifique a senha no MongoDB Atlas
- Certifique-se de substituir `<password>` na string de conexão

### Erro: "ECONNREFUSED"
**Causa:** MongoDB local não está rodando

**Solução:**
```bash
# Iniciar MongoDB manualmente
mongod

# Ou como serviço
net start MongoDB
```

## 🎯 Recomendação

Para desenvolvimento rápido, use **MongoDB Atlas** (Opção 1). É mais simples e não requer instalação.

Para produção ou se preferir trabalhar offline, use **MongoDB Local** (Opção 2).

## 📝 Próximos Passos

Após configurar o MongoDB:

1. ✅ Atualize o arquivo `backend/.env` com a string de conexão
2. ✅ Execute `npm run seed` para criar usuários de teste
3. ✅ Execute `npm run dev` para iniciar o backend
4. ✅ Acesse http://localhost:3000 para verificar se está funcionando

## 🆘 Ainda com Problemas?

Se continuar com erros:
1. Verifique os logs do terminal
2. Confirme que a string de conexão está correta no `.env`
3. Teste a conexão com MongoDB Compass (interface gráfica)
4. Verifique se o firewall não está bloqueando a conexão
