const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Basic payment operations
router.post('/payments', paymentController.insertPayment);
router.get('/payments/user/:userId', paymentController.getUserPaymentHistory);
router.put('/payments/status', paymentController.updatePaymentStatus);
router.delete('/payments/:paymentId', paymentController.deletePayment);

// Revenue
router.get('/payments/restaurant/:restaurantId/revenue', paymentController.getTotalRevenueByRestaurant);

module.exports = router;
