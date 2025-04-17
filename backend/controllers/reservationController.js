const ReservationModel = require('../models/reservationModel');

// Add a reservation
exports.addReservation = async (req, res) => {
  try {
    const { userId, tableId, time, duration, people, request } = req.body;
    const result = await ReservationModel.addReservation(userId, tableId, time, duration, people, request);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modify a reservation
exports.modifyReservation = async (req, res) => {
  try {
    const { reservationId, userId, newTime, newDuration, newPeople, newRequest } = req.body;
    const result = await ReservationModel.modifyReservation(reservationId, userId, newTime, newDuration, newPeople, newRequest);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId, userId } = req.body;
    const result = await ReservationModel.cancelReservation(reservationId, userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve a reservation
exports.approveReservation = async (req, res) => {
  try {
    const { reservationId, userId } = req.body;
    const result = await ReservationModel.approveReservation(reservationId, userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Complete a reservation
exports.completeReservation = async (req, res) => {
  try {
    const { reservationId, userId } = req.body;
    const result = await ReservationModel.completeReservation(reservationId, userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View upcoming reservations for a user
exports.viewUpcomingReservations = async (req, res) => {
  try {
    const result = await ReservationModel.viewUpcomingReservations(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View past reservations for a user
exports.viewPastReservations = async (req, res) => {
  try {
    const result = await ReservationModel.viewPastReservations(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reservations for a restaurant
exports.getRestaurantReservations = async (req, res) => {
  try {
    const result = await ReservationModel.getRestaurantReservations(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reservations with special requests
exports.getReservationsWithRequests = async (req, res) => {
  try {
    const result = await ReservationModel.getReservationsWithRequests();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Process payment for a reservation
exports.processPayment = async (req, res) => {
  try {
    const { reservationId, amount, method } = req.body;
    const result = await ReservationModel.processPayment(reservationId, amount, method);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
