const PaymentModel = require('../models/paymentModel');

// Insert a new payment
exports.insertPayment = async (req, res) => {
  try {
    const { paymentId, reservationId, amount, status, method } = req.body;
    const response = await PaymentModel.insertPayment(paymentId, reservationId, amount, status, method);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's payment history
exports.getUserPaymentHistory = async (req, res) => {
  try {
    const result = await PaymentModel.getUserPaymentHistory(req.params.userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, newStatus } = req.body;
    const response = await PaymentModel.updatePaymentStatus(paymentId, newStatus);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a payment (admin only)
exports.deletePayment = async (req, res) => {
  try {
    const response = await PaymentModel.deletePayment(req.params.paymentId);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get total revenue for a restaurant
exports.getTotalRevenueByRestaurant = async (req, res) => {
  try {
    const result = await PaymentModel.getTotalRevenueByRestaurant(req.params.restaurantId);
    if (!result) return res.status(404).json({ message: 'No revenue data found for the restaurant' });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
