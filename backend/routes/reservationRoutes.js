const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Basic reservation operations
router.post('/reservations/:id', reservationController.addReservation);
router.put('/reservations', reservationController.modifyReservation);
router.delete('/reservations', reservationController.cancelReservation);

// Status updates
router.post('/reservations/approve', reservationController.approveReservation);
router.post('/reservations/complete', reservationController.completeReservation);

// User-specific reservations
router.get('/reservations/:id', reservationController.viewReservations);

// Restaurant-specific reservations
router.get('/restaurants/:id/reservations', reservationController.getRestaurantReservations);

// Payments
router.post('/reservations/payment', reservationController.processPayment);

module.exports = router;
