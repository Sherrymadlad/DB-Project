const { sql, poolPromise } = require('../config/db');

const TableModel = {
  //Get all tables by restaurant
  getTablesByRestaurant: async (id) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input("Restaurantid", sql.Int, id)
        .query(`
            SELECT * FROM Tables WHERE RestaurantID = @Restaurantid
        `);
        return result.recordset;
    } catch (error){
      throw new Error(error.message);
    }
  },

//Check to see if a table is available
  checkTableAvailability: async (tableId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('TableID', sql.Int, tableId)
        .execute('CheckTableAvailability');
      return result.recordset[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Add a new table to a restaurant
  addTable: async (userId, tableId, capacity, description, restaurantId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .input('TableID', sql.Int, tableId)
        .input('Capacity', sql.Int, capacity)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .input('RestaurantID', sql.Int, restaurantId)
        .execute('AddTable');
      return { message: 'Table added successfully.' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Update table information
  updateTable: async (userId, tableId, capacity = null, status = null, description = null) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .input('TableID', sql.Int, tableId)
        .input('Capacity', sql.Int, capacity)
        .input('Status', sql.NVarChar(10), status)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .execute('UpdateTable');
      return { message: 'Table updated successfully.' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Delete a table
  deleteTable: async (userId, tableId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .input('TableID', sql.Int, tableId)
        .execute('DeleteTable');
      return { message: 'Table deleted successfully.' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Update table's availability status
  updateTableStatus: async (userId, tableId, newStatus) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .input('TableID', sql.Int, tableId)
        .input('NewStatus', sql.NVarChar(10), newStatus)
        .execute('UpdateTableStatus');
      return { message: 'Table status updated.' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Retrieve all the available tables
  getAvailableTables: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .execute('GetAvailableTables');
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Retrieve tables by their capacity
  getTablesByCapacity: async (restaurantId, minCapacity) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .input('MinCapacity', sql.Int, minCapacity)
        .execute('GetTablesByCapacity');
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Reset table at closing time
  resetTablesAtClosing: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .execute('ResetTablesAtClosing');
      return { message: 'Tables reset after closing time.' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

};

module.exports = TableModel;
