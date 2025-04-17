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

// User-specific reservations
router.get('/reservations/upcoming/:id', reservationController.viewUpcomingReservations);
router.get('/reservations/past/:id', reservationController.viewPastReservations);

// Restaurant-specific reservations
router.get('/restaurants/:id/reservations', reservationController.getRestaurantReservations);

// Special request filter
router.get('/reservations/requests', reservationController.getReservationsWithRequests);

// Payments
router.post('/reservations/payment', reservationController.processPayment);

module.exports = router;
