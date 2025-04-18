const ReservationModel = require('../models/reservationModel');

// Add a reservation
exports.addReservation = async (req, res) => {
  try {
    const { userId, tableId, time, duration, people, request } = req.body;
    const result = await ReservationModel.addReservation(req.params.id,userId, tableId, time, duration, people, request);
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

// View reservations for a user
exports.viewReservations = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const status = req.body.status || null;

    const result = await ReservationModel.viewReservations(userId, status);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reservations for a restaurant
exports.getRestaurantReservations = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await ReservationModel.getRestaurantReservations(req.params.id, status);
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
