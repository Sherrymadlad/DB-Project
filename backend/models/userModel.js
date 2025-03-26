const { sql, poolPromise } = require('../config/db');

const RestaurantModel = {
  createRestaurant: async (name, description, location, phoneNum, operatingHoursStart, operatingHoursEnd, adminUserID) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('Name', sql.NVarChar, name)
        .input('Description', sql.NVarChar, description)
        .input('Location', sql.NVarChar, location)
        .input('PhoneNum', sql.NVarChar, phoneNum)
        .input('OperatingHoursStart', sql.Time, operatingHoursStart)
        .input('OperatingHoursEnd', sql.Time, operatingHoursEnd)
        .input('AdminUserID', sql.Int, adminUserID)
        .query(`
          INSERT INTO Restaurants (Name, Description, Location, PhoneNum, OperatingHoursStart, OperatingHoursEnd, AdminUserID)
          VALUES (@Name, @Description, @Location, @PhoneNum, @OperatingHoursStart, @OperatingHoursEnd, @AdminUserID)
        `);
      return { message: 'Restaurant created successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getRestaurantById: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .query('SELECT * FROM Restaurants WHERE RestaurantID = @RestaurantID');
      return result.recordset[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllRestaurants: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query('SELECT * FROM Restaurants');
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateRestaurant: async (restaurantId, updatedFields) => {
    try {
      const pool = await poolPromise;
      let query = 'UPDATE Restaurants SET ';
      const fields = [];
      
      Object.keys(updatedFields).forEach((key, index) => {
        fields.push(`${key} = @${key}`);
      });

      query += fields.join(', ') + ' WHERE RestaurantID = @RestaurantID';

      const request = pool.request();
      request.input('RestaurantID', sql.Int, restaurantId);
      Object.keys(updatedFields).forEach(key => {
        request.input(key, sql.NVarChar, updatedFields[key]); 
      });

      await request.query(query);
      return { message: 'Restaurant updated successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteRestaurant: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .query('DELETE FROM Restaurants WHERE RestaurantID = @RestaurantID');
      return { message: 'Restaurant deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = RestaurantModel;
