const express = require('express');
const { 
  createCheckoutSession,
  handleStripeWebhook,
  getUserPurchases,
  getPurchaseById,
  verifyPaymentSuccess
} = require('../controllers/purchaseController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Purchase management
 */

const router = express.Router();

/**
 * @swagger
 * /api/purchases/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *       400:
 *         description: Webhook error
 *       500:
 *         description: Internal server error
 */
// IMPORTANTE: Webhook deve vir ANTES das outras rotas para usar express.raw()
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

/**
 * @swagger
 * /api/purchases/checkout:
 *   post:
 *     summary: Create checkout session
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materialId:
 *                 type: string
 *             required:
 *               - materialId
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Material not found
 *       500:
 *         description: Internal server error
 */
router.post('/checkout', auth, createCheckoutSession);

/**
 * @swagger
 * /api/purchases/verify-payment:
 *   post:
 *     summary: Verify payment success and register purchase
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               session_id:
 *                 type: string
 *             required:
 *               - session_id
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Payment not completed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/verify-payment', auth, verifyPaymentSuccess);

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Get user's purchases
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchases retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Purchase'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', auth, getUserPurchases);

/**
 * @swagger
 * /api/purchases/{id}:
 *   get:
 *     summary: Get specific purchase
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', auth, getPurchaseById);

module.exports = router;