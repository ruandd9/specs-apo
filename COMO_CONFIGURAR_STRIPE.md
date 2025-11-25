# 🚀 Como Configurar o Stripe - Passo a Passo Rápido

## ❌ Problema Atual
Você está vendo o erro: **"Invalid API Key provided"**

Isso acontece porque as chaves do Stripe no arquivo `.env` são placeholders (valores de exemplo).

## ✅ Solução - 3 Passos Simples

### 1️⃣ Criar Conta no Stripe (se ainda não tem)
- Acesse: https://dashboard.stripe.com/register
- Crie uma conta gratuita (não precisa de cartão de crédito)

### 2️⃣ Obter suas Chaves de API
1. Faça login no Stripe
2. Acesse: https://dashboard.stripe.com/test/apikeys
3. Você verá duas chaves:
   - **Publishable key** (começa com `pk_test_...`)
   - **Secret key** (começa com `sk_test_...`) - clique em "Reveal test key" para ver

### 3️⃣ Atualizar o arquivo `.env`
1. Abra o arquivo `backend/.env`
2. Substitua estas linhas:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```
   
   Por suas chaves reais:
   ```env
   STRIPE_SECRET_KEY=sk_test_51ABC...XYZ
   STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...XYZ
   ```

3. Salve o arquivo
4. Reinicie o servidor backend (Ctrl+C e depois `npm start`)

## 🧪 Testar o Pagamento

Após configurar, use este cartão de teste:
- **Número:** 4242 4242 4242 4242
- **Data:** 12/25 (qualquer data futura)
- **CVC:** 123 (qualquer 3 dígitos)
- **CEP:** 12345-678 (qualquer CEP)

## ⚠️ Importante
- Estas são chaves de **TESTE** (começam com `test`)
- Nenhum pagamento real será processado
- Você pode testar à vontade sem custos

## 🎯 Próximos Passos (Opcional)
Se quiser receber notificações de pagamento em tempo real, configure o webhook:
- Veja instruções completas em: `CONFIGURAR_STRIPE.md`

---

**Dúvidas?** Consulte a documentação completa em `CONFIGURAR_STRIPE.md`
