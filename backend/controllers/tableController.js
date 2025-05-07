const TableModel = require('../models/tableModel');

exports.getTablesByRestaurant = async (req, res) => {
  try {
    const result = await TableModel.getTablesByRestaurant(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkTableAvailability = async (req, res) => {
  try {
    const result = await TableModel.checkTableAvailability(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTable = async (req, res) => {
  try {
    const { userId, capacity, description, restaurantId } = req.body;
    const result = await TableModel.addTable(userId, capacity, description, restaurantId);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const { userId, capacity, status, description } = req.body;
    const tableId = req.params.id;
    const result = await TableModel.updateTable(userId, tableId, capacity, status, description);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await TableModel.deleteTable(userId, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTableStatus = async (req, res) => {
  try {
    const { userId, newStatus } = req.body;
    const tableId = req.params.id;
    const result = await TableModel.updateTableStatus(userId, tableId, newStatus);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableTables = async (req, res) => {
  try {
    const result = await TableModel.getAvailableTables(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTablesByCapacity = async (req, res) => {
  try {
    const { minCapacity } = req.query;
    const result = await TableModel.getTablesByCapacity(req.params.id, parseInt(minCapacity));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTablesByCapacityAndTime = async (req, res) => {
  try {
    const { minCapacity, startTime, durationMinutes } = req.query;
    const result = await TableModel.getTablesByCapacity(req.params.id, minCapacity, startTime, durationMinutes);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetTablesAtClosing = async (req, res) => {
  try {
    const result = await TableModel.resetTablesAtClosing(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
