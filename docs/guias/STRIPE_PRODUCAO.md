# 💰 Stripe em Produção - Recebendo Pagamentos Reais

## ⚠️ IMPORTANTE: Você Está em Modo TESTE

Atualmente, seu sistema está configurado em **modo de teste** do Stripe. Isso significa:

- ❌ **Nenhum dinheiro real está sendo processado**
- ❌ **Nenhum cartão real está sendo cobrado**
- ✅ **Todos os pagamentos são simulações**
- ✅ **Perfeito para desenvolvimento e testes**

---

## 🔍 Entendendo Modo Teste vs Produção

### Modo Teste (Atual)

```env
STRIPE_SECRET_KEY=sk_test_51SXRkj...
STRIPE_PUBLISHABLE_KEY=pk_test_51SXRkj...
```

**Características:**
- Aceita qualquer número de cartão de teste
- Nenhuma transação real acontece
- Não há cobranças ou transferências
- Dashboard em: https://dashboard.stripe.com/test/payments
- Ideal para desenvolvimento

**Cartões de Teste:**
- `4242 4242 4242 4242` - Pagamento bem-sucedido
- `4000 0000 0000 0002` - Pagamento recusado
- `4000 0025 0000 3155` - Requer autenticação 3D Secure

### Modo Produção (Para Receber Dinheiro Real)

```env
STRIPE_SECRET_KEY=sk_live_51ABC...
STRIPE_PUBLISHABLE_KEY=pk_live_51ABC...
```

**Características:**
- Apenas cartões reais são aceitos
- Transações reais são processadas
- Dinheiro é transferido para sua conta bancária
- Dashboard em: https://dashboard.stripe.com/payments
- Cobra taxas reais do Stripe

---

## 💸 Como Funciona o Fluxo de Dinheiro Real

```
1. Cliente compra apostila por R$ 100,00
   ↓
2. Stripe processa o pagamento no cartão do cliente
   ↓
3. Stripe retém sua taxa (4.99% + R$ 0,39)
   Taxa: R$ 5,38
   ↓
4. Você recebe: R$ 94,62
   ↓
5. Stripe transfere para sua conta bancária
   Prazo: 2-7 dias úteis (configurável)
```

### Taxas do Stripe no Brasil

| Tipo de Transação | Taxa |
|-------------------|------|
| Cartão de Crédito Nacional | 4.99% + R$ 0,39 |
| Cartão de Crédito Internacional | 5.99% + R$ 0,39 |
| Boleto Bancário | 3.99% + R$ 2,00 |
| PIX | 1.99% (sem taxa fixa) |

**Exemplo de Cálculo:**
- Venda: R$ 100,00
- Taxa Stripe: R$ 5,38 (4.99% + R$ 0,39)
- **Você recebe: R$ 94,62**

---

## 🚀 Passo a Passo para Ir para Produção

### Passo 1: Ativar Conta Stripe

1. **Acesse o Dashboard do Stripe:**
   - https://dashboard.stripe.com

2. **Complete o Processo de Verificação:**
   - Informações da empresa/pessoa física
   - Documentos (CPF/CNPJ, comprovante de endereço)
   - Informações bancárias
   - Descrição do negócio

3. **Aguarde Aprovação:**
   - Geralmente leva 1-3 dias úteis
   - Stripe pode solicitar documentos adicionais

### Passo 2: Configurar Conta Bancária

1. **No Dashboard do Stripe:**
   - Vá em "Settings" → "Bank accounts and scheduling"

2. **Adicione sua Conta Bancária:**
   - Banco
   - Agência
   - Número da conta
   - Tipo de conta (corrente/poupança)

3. **Configure o Cronograma de Transferências:**
   - Automático (recomendado): A cada 2-7 dias
   - Manual: Você solicita quando quiser
   - Mínimo para transferência: R$ 1,00 (padrão)

### Passo 3: Obter Chaves de Produção

1. **Acesse:**
   - https://dashboard.stripe.com/apikeys (não /test/)

2. **Copie as Chaves:**
   - **Publishable key:** `pk_live_...`
   - **Secret key:** `sk_live_...` (clique em "Reveal live key")

⚠️ **ATENÇÃO:** Nunca compartilhe ou commite a chave secreta!

### Passo 4: Atualizar Variáveis de Ambiente

**NO SERVIDOR DE PRODUÇÃO** (não no desenvolvimento!):

```env
# Produção - Pagamentos Reais
STRIPE_SECRET_KEY=sk_live_51ABC123XYZ789...
STRIPE_PUBLISHABLE_KEY=pk_live_51ABC123XYZ789...
STRIPE_WEBHOOK_SECRET=whsec_ABC123XYZ789...
```

### Passo 5: Configurar Webhook de Produção

1. **Acesse:**
   - https://dashboard.stripe.com/webhooks (não /test/)

2. **Adicione Endpoint:**
   - URL: `https://seu-dominio.com/api/purchases/webhook`
   - Eventos: `checkout.session.completed`

3. **Copie o Signing Secret:**
   - Adicione ao `.env` como `STRIPE_WEBHOOK_SECRET`

### Passo 6: Testar com Transação Real

1. **Faça uma Compra de Teste:**
   - Use um cartão real
   - Valor pequeno (ex: R$ 1,00)
   - Verifique se aparece no Dashboard

2. **Verifique:**
   - ✅ Pagamento processado
   - ✅ Apostila liberada para o usuário
   - ✅ Registro no banco de dados
   - ✅ Webhook recebido

3. **Monitore a Transferência:**
   - Aguarde 2-7 dias
   - Verifique se o dinheiro chegou na conta

---

## 🔒 Segurança em Produção

### ❌ NUNCA Faça Isso:

1. **Commitar chaves de produção no Git**
   ```bash
   # ERRADO!
   git add backend/.env
   git commit -m "add env"
   ```

2. **Compartilhar chaves secretas**
   - Não envie por email
   - Não poste em fóruns
   - Não compartilhe em chat

3. **Usar chaves de produção em desenvolvimento**
   - Sempre use `sk_test_...` localmente
   - Apenas `sk_live_...` em produção

4. **Expor chaves no frontend**
   - Apenas `pk_live_...` pode ir no frontend
   - `sk_live_...` NUNCA deve estar no frontend

### ✅ SEMPRE Faça Isso:

1. **Use variáveis de ambiente**
   ```javascript
   // Correto
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   ```

2. **Mantenha .env no .gitignore**
   ```gitignore
   # .gitignore
   backend/.env
   frontend/.env
   .env
   ```

3. **Use diferentes chaves por ambiente**
   - Desenvolvimento: `sk_test_...`
   - Staging: `sk_test_...`
   - Produção: `sk_live_...`

4. **Monitore transações suspeitas**
   - Configure alertas no Stripe
   - Revise transações regularmente

---

## 📊 Monitoramento e Gestão

### Dashboard do Stripe

**Acesse:** https://dashboard.stripe.com

**Principais Seções:**

1. **Payments** - Ver todas as transações
2. **Customers** - Gerenciar clientes
3. **Disputes** - Contestações de pagamento
4. **Payouts** - Transferências para sua conta
5. **Reports** - Relatórios financeiros
6. **Logs** - Logs de API e webhooks

### Relatórios Importantes

1. **Vendas Diárias:**
   - Dashboard → Reports → Daily summary

2. **Taxas Cobradas:**
   - Dashboard → Reports → Fees

3. **Transferências:**
   - Dashboard → Balance → Payouts

4. **Falhas de Pagamento:**
   - Dashboard → Payments → Failed

---

## 🛠️ Troubleshooting

### Problema: Pagamento Aprovado mas Apostila Não Liberada

**Causa:** Webhook não está funcionando

**Solução:**
1. Verifique se o webhook está configurado
2. Teste o endpoint: `POST /api/purchases/webhook`
3. Veja logs em: Dashboard → Developers → Webhooks

### Problema: Transferência Não Chegou

**Causa:** Conta bancária não verificada ou prazo não atingido

**Solução:**
1. Verifique status da conta: Dashboard → Settings → Bank accounts
2. Aguarde o prazo (2-7 dias)
3. Verifique se atingiu o mínimo (R$ 1,00)

### Problema: Taxa Maior que Esperado

**Causa:** Cartão internacional ou tipo de transação diferente

**Solução:**
1. Verifique tipo de cartão no Dashboard
2. Cartões internacionais têm taxa maior (5.99%)
3. Considere adicionar taxa ao preço

### Problema: Pagamento Recusado

**Causas Comuns:**
- Saldo insuficiente
- Cartão bloqueado
- Dados incorretos
- Limite excedido

**Solução:**
- Cliente deve contatar banco
- Tentar outro cartão
- Verificar dados digitados

---

## 💡 Dicas para Maximizar Vendas

### 1. Preços Estratégicos

Considere as taxas do Stripe ao definir preços:

```
Preço desejado: R$ 100,00
Taxa Stripe: R$ 5,38
Preço de venda: R$ 105,38 (para receber R$ 100)
```

Ou absorva a taxa:
```
Preço de venda: R$ 100,00
Você recebe: R$ 94,62
```

### 2. Ofereça Múltiplas Formas de Pagamento

- Cartão de crédito (padrão)
- PIX (taxa menor: 1.99%)
- Boleto (para quem não tem cartão)

### 3. Configure Retry de Pagamentos

Para assinaturas, configure tentativas automáticas:
- Dashboard → Settings → Billing → Smart retries

### 4. Use Cupons de Desconto

Aumente conversão com promoções:
- Dashboard → Products → Coupons

### 5. Monitore Métricas

Acompanhe:
- Taxa de conversão
- Valor médio de venda
- Taxa de abandono no checkout
- Chargebacks

---

## 📋 Checklist de Produção

Antes de ir para produção, verifique:

### Conta Stripe
- [ ] Conta verificada e aprovada
- [ ] Conta bancária adicionada e verificada
- [ ] Cronograma de transferências configurado
- [ ] Informações fiscais completas

### Configuração Técnica
- [ ] Chaves de produção obtidas
- [ ] Variáveis de ambiente atualizadas no servidor
- [ ] Webhook de produção configurado
- [ ] SSL/HTTPS configurado no domínio

### Testes
- [ ] Transação real de teste realizada (R$ 1,00)
- [ ] Apostila liberada corretamente
- [ ] Webhook recebido e processado
- [ ] Email de confirmação enviado (se implementado)

### Segurança
- [ ] Chaves secretas não estão no Git
- [ ] .env no .gitignore
- [ ] Apenas chaves de teste em desenvolvimento
- [ ] Rate limiting configurado

### Monitoramento
- [ ] Alertas configurados no Stripe
- [ ] Logs de erro configurados
- [ ] Dashboard de vendas funcionando
- [ ] Backup do banco de dados configurado

---

## 🆘 Suporte

### Documentação Oficial
- **Stripe Docs:** https://stripe.com/docs
- **API Reference:** https://stripe.com/docs/api
- **Webhooks:** https://stripe.com/docs/webhooks

### Suporte Stripe
- **Email:** support@stripe.com
- **Chat:** Disponível no Dashboard
- **Telefone:** Disponível para contas verificadas

### Comunidade
- **Stack Overflow:** Tag `stripe`
- **GitHub:** https://github.com/stripe
- **Discord:** Comunidade Stripe Brasil

---

## 📈 Próximos Passos

Após configurar produção:

1. **Implementar PIX** (taxa menor)
2. **Adicionar Boleto** (mais opções)
3. **Sistema de Cupons** (aumentar vendas)
4. **Assinaturas** (receita recorrente)
5. **Relatórios Avançados** (análise de dados)

---

## ⚖️ Aspectos Legais

### Impostos

Você é responsável por:
- Emitir notas fiscais
- Declarar receitas
- Pagar impostos devidos

O Stripe **não** retém impostos automaticamente no Brasil.

### Termos de Uso

Certifique-se de ter:
- Termos de uso do site
- Política de privacidade
- Política de reembolso
- Contrato de licença das apostilas

### Compliance

- PCI DSS: Stripe cuida disso
- LGPD: Você deve estar em conformidade
- Direitos autorais: Garanta que tem direitos sobre o conteúdo

---

## 🎯 Resumo

**Modo Teste (Atual):**
- ✅ Perfeito para desenvolvimento
- ✅ Sem riscos financeiros
- ✅ Testes ilimitados
- ❌ Não recebe dinheiro real

**Modo Produção (Futuro):**
- ✅ Recebe pagamentos reais
- ✅ Dinheiro na conta bancária
- ⚠️ Requer verificação
- ⚠️ Cobra taxas reais

**Quando Mudar:**
- Quando o sistema estiver 100% testado
- Quando tiver conta bancária configurada
- Quando estiver pronto para vender
- Quando tiver suporte ao cliente preparado

---

**Última atualização:** 25/11/2025  
**Status Atual:** Modo Teste ✅  
**Próximo Passo:** Completar verificação da conta Stripe
