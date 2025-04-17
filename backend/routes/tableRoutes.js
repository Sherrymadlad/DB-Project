const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Get all tables in a restaurant
router.get('/restaurants/:id/tables', tableController.getTablesByRestaurant);

// Check if a specific table is available
router.get('/tables/:id/availability', tableController.checkTableAvailability);

// Add a new table
router.post('/tables', tableController.addTable);

// Update a table's details
router.put('/tables/:id', tableController.updateTable);

// Delete a table
router.delete('/tables/:id', tableController.deleteTable);

// Update a table's status (e.g. Available, Reserved, etc.)
router.put('/tables/:id/status', tableController.updateTableStatus);

// Get available tables in a restaurant
router.get('/restaurants/:id/tables/available', tableController.getAvailableTables);

// Get tables in a restaurant with at least a minimum capacity
router.get('/restaurants/:id/tables/by-capacity', tableController.getTablesByCapacity);

// Reset all tables in a restaurant at closing time
router.post('/restaurants/:id/tables/reset', tableController.resetTablesAtClosing);

module.exports = router;
