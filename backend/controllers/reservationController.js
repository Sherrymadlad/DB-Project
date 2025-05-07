const ReservationModel = require('../models/reservationModel');

module.exports = {
  addReservation: async (req, res) => {
    const { userId, tableId, time, duration, people, request: specialRequest } = req.body;
    try {
      const data = await ReservationModel.addReservation(
        userId, tableId, time, duration, people, specialRequest || null
      );
      res.status(201).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to add reservation', error: error.message });
    }
  },

  modifyReservation: async (req, res) => {
    const { reservationId, userId, newTime, newDuration, newPeople, newRequest } = req.body;
    try {
      const data = await ReservationModel.modifyReservation(
        reservationId, userId,
        newTime ? new Date(newTime) : null,
        newDuration || null, newPeople || null, newRequest || null
      );
      res.status(200).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to modify reservation', error: error.message });
    }
  },

  cancelReservation: async (req, res) => {
    const { reservationId, userId } = req.body;
    try {
      const data = await ReservationModel.cancelReservation(reservationId, userId);
      res.status(200).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to cancel reservation', error: error.message });
    }
  },

  approveReservation: async (req, res) => {
    const { reservationId, userId } = req.body;
    try {
      const data = await ReservationModel.approveReservation(reservationId, userId);
      res.status(200).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to approve reservation', error: error.message });
    }
  },

  completeReservation: async (req, res) => {
    const { reservationId, userId } = req.body;
    try {
      const data = await ReservationModel.completeReservation(reservationId, userId);
      res.status(200).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to complete reservation', error: error.message });
    }
  },

  viewReservationsUser: async (req, res) => {
    const { userId, status } = req.query;
    try {
      const data = await ReservationModel.viewReservationsUser(
        userId,
        status ? status : null
      );
      if (!data.length)
        return res.status(404).json({ success: false, message: 'No reservations found' });

      res.status(200).json({ success: true, message: 'Reservations retrieved', data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving reservations', error: error.message });
    }
  },

  processPayment: async (req, res) => {
    const { reservationId, amount, method } = req.body;
    try {
      const data = await ReservationModel.processPayment(reservationId, amount, method);
      res.status(200).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Payment failed', error: error.message });
    }
  }
};