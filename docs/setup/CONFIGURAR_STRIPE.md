# 💳 Configurar Stripe para Pagamentos

## Passo 1: Criar Conta no Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Crie uma conta gratuita
3. Preencha as informações básicas

## Passo 2: Obter Chaves de API (Modo Teste)

1. Após fazer login, vá para: https://dashboard.stripe.com/test/apikeys
2. Você verá duas chaves:
   - **Publishable key** (começa com `pk_test_`)
   - **Secret key** (começa com `sk_test_`) - clique em "Reveal test key"

3. Copie ambas as chaves

## Passo 3: Atualizar arquivo .env

Abra `backend/.env` e atualize:

```env
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_SECRETA_AQUI
STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_PUBLICA_AQUI
FRONTEND_URL=http://localhost:3001
```

## Passo 4: Configurar Webhook (Opcional para Desenvolvimento)

Para receber notificações de pagamento em tempo real:

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique em "Add endpoint"
3. URL do endpoint: `http://localhost:3000/api/purchases/webhook`
4. Selecione eventos:
   - `checkout.session.completed`
5. Copie o "Signing secret" (começa com `whsec_`)
6. Adicione no `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET_AQUI
   ```

**NOTA:** Para desenvolvimento local, você pode usar o Stripe CLI para testar webhooks:
```bash
stripe listen --forward-to localhost:3000/api/purchases/webhook
```

## Passo 5: Testar Pagamento

Use cartões de teste do Stripe:

### Cartão de Sucesso:
- **Número:** 4242 4242 4242 4242
- **Data:** Qualquer data futura (ex: 12/25)
- **CVC:** Qualquer 3 dígitos (ex: 123)
- **CEP:** Qualquer CEP

### Outros Cartões de Teste:
- **Pagamento recusado:** 4000 0000 0000 0002
- **Requer autenticação:** 4000 0025 0000 3155

## Passo 6: Verificar Configuração

Após configurar, reinicie o backend:
```bash
cd backend
npm run dev
```

Teste fazendo uma compra no site. Você deve:
1. Ser redirecionado para página do Stripe
2. Preencher dados do cartão de teste
3. Ser redirecionado de volta para `/success`
4. Ver a apostila em "Minhas Apostilas"

## 🔍 Verificar Pagamentos

Acesse o Dashboard do Stripe:
- Pagamentos: https://dashboard.stripe.com/test/payments
- Clientes: https://dashboard.stripe.com/test/customers
- Logs: https://dashboard.stripe.com/test/logs

## ⚠️ Importante

- As chaves `pk_test_` e `sk_test_` são para TESTE
- Nenhum pagamento real é processado
- Para produção, use chaves `pk_live_` e `sk_live_`
- NUNCA compartilhe suas chaves secretas!

## 🚀 Produção

⚠️ **IMPORTANTE:** Atualmente você está em **modo de teste**. Nenhum pagamento real está sendo processado!

Para receber pagamentos reais e configurar produção, consulte o guia completo:

👉 **[STRIPE_PRODUCAO.md](./STRIPE_PRODUCAO.md)** - Guia Completo de Produção

**Resumo rápido:**
1. Complete o processo de ativação da conta no Stripe
2. Configure conta bancária para receber transferências
3. Obtenha as chaves LIVE (não test)
4. Atualize o `.env` de produção
5. Configure webhook de produção com URL pública
6. Teste com transação real pequena (R$ 1,00)

**Quando mudar para produção:**
- ✅ Sistema 100% testado
- ✅ Conta Stripe verificada
- ✅ Conta bancária configurada
- ✅ Pronto para receber dinheiro real

## 💡 Dicas

- Mantenha o Dashboard do Stripe aberto para monitorar transações
- Use o modo teste para desenvolvimento
- Documente todas as transações importantes
- Configure notificações por email no Stripe
