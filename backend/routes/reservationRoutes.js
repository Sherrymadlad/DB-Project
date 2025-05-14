const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Basic reservation operations
router.post('/reservations', reservationController.addReservation);
router.put('/reservations', reservationController.modifyReservation);
router.delete('/reservations', reservationController.cancelReservation);

// Status updates
router.post('/reservations/approve', reservationController.approveReservation);
router.post('/reservations/complete', reservationController.completeReservation);

// Reservations for specific User/Restaurant
router.get('/reservations-user', reservationController.viewReservationsUser);
router.get('/reservations-rest', reservationController.viewReservationsRestaurant);
router.get('/reservations-rest-today', reservationController.viewReservationsToday);

// Payments
router.post('/reservations/payment', reservationController.processPayment);

module.exports = router;
