const express = require('express');
const { 
  getAllLogs,
  getLogById,
  getLogsByUser,
  getLogsByAction
} = require('../controllers/logController');
const { auth, admin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: System logs and audit trails
 */

const router = express.Router();

// All routes require authentication and admin privileges
router.use(auth, admin);

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get all logs (paginated)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       action:
 *                         type: string
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       material:
 *                         $ref: '#/components/schemas/Material'
 *                       ipAddress:
 *                         type: string
 *                       userAgent:
 *                         type: string
 *                       details:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllLogs);

/**
 * @swagger
 * /api/logs/{id}:
 *   get:
 *     summary: Get log by ID
 *     tags: [Logs]
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
 *         description: Log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 action:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 material:
 *                   $ref: '#/components/schemas/Material'
 *                 ipAddress:
 *                   type: string
 *                 userAgent:
 *                   type: string
 *                 details:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Log not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getLogById);

/**
 * @swagger
 * /api/logs/user/{userId}:
 *   get:
 *     summary: Get logs by user
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       action:
 *                         type: string
 *                       material:
 *                         $ref: '#/components/schemas/Material'
 *                       ipAddress:
 *                         type: string
 *                       userAgent:
 *                         type: string
 *                       details:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', getLogsByUser);

/**
 * @swagger
 * /api/logs/action/{action}:
 *   get:
 *     summary: Get logs by action
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [view, access_denied, purchase, login, register, admin_action]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       action:
 *                         type: string
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       material:
 *                         $ref: '#/components/schemas/Material'
 *                       ipAddress:
 *                         type: string
 *                       userAgent:
 *                         type: string
 *                       details:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/action/:action', getLogsByAction);

module.exports = router;