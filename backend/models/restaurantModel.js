const { sql, poolPromise } = require('../config/db');

const RestaurantModel = {
  // Fetch all restaurants
  getRestaurants: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query(`SELECT * FROM Restaurants`);
      if (result.recordset.length === 0) {
        return { success: false, message: 'No restaurants found' };
      }
      return { success: true, data: result.recordset };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Fetch a restaurant by its ID
  getRestaurantById: async (id) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, id)
        .query(`SELECT * FROM Restaurants WHERE RestaurantID = @RestaurantID`);
      if (result.recordset.length === 0) {
        return { success: false, message: 'Restaurant not found' };
      }
      return { success: true, data: result.recordset[0] };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Register a new restaurant
  registerRestaurant: async (data) => {
    try {
      const {
        UserID, Name, Description,
        Location, PhoneNum, OperatingHoursStart,
        OperatingHoursEnd, ProfilePic
      } = data;
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, UserID)
        .input('Name', sql.NVarChar(50), Name)
        .input('Description', sql.NVarChar(sql.MAX), Description)
        .input('Location', sql.NVarChar(100), Location)
        .input('PhoneNum', sql.NVarChar(13), PhoneNum)
        .input('OperatingHoursStart', sql.Time, OperatingHoursStart)
        .input('OperatingHoursEnd', sql.Time, OperatingHoursEnd)
        .input('ProfilePic', sql.VarBinary(sql.MAX), ProfilePic)
        .execute('RegisterRestaurant');
      return { success: true, message: 'Restaurant registered successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update an existing restaurant
  updateRestaurant: async (data) => {
    try {
      const {
        UserID, RestaurantID, Name, Description,
        Location, PhoneNum, OperatingHoursStart,
        OperatingHoursEnd, Status, ProfilePic
      } = data;

      const pool = await poolPromise;
      const request = pool.request()
        .input('UserID', sql.Int, UserID)
        .input('RestaurantID', sql.Int, RestaurantID);

      if (Name) {
        request.input('Name', sql.NVarChar(50), Name);
      }
      if (Description) {
        request.input('Description', sql.NVarChar(sql.MAX), Description);
      }
      if (Location) {
        request.input('Location', sql.NVarChar(100), Location);
      }
      if (PhoneNum) {
        request.input('PhoneNum', sql.NVarChar(13), PhoneNum);
      }
      if (OperatingHoursStart) {
        request.input('OperatingHoursStart', sql.Time, OperatingHoursStart);
      }
      if (OperatingHoursEnd) {
        request.input('OperatingHoursEnd', sql.Time, OperatingHoursEnd);
      }
      if (Status) {
        request.input('Status', sql.NVarChar(10), Status);
      }
      if (ProfilePic) {
        request.input('ProfilePic', sql.VarBinary(sql.MAX), ProfilePic);
      }

      await request.execute('UpdateRestaurant');
      return { success: true, message: 'Restaurant updated successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Delete a restaurant
  deleteRestaurant: async (UserID, RestaurantID) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, UserID)
        .input('RestaurantID', sql.Int, RestaurantID)
        .execute('DeleteRestaurant');
      return { success: true, message: 'Restaurant deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get restaurants by their status
  getRestaurantsByStatus: async (status) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('Status', sql.NVarChar(10), status)
        .execute('GetRestaurantsByStatus');
      if (result.recordset.length === 0) {
        return { success: false, message: 'No restaurants found for this status' };
      }
      return { success: true, data: result.recordset };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get restaurants by their cuisine ID
  getRestaurantsByCuisine: async (cuisineId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('CuisineID', sql.Int, cuisineId)
        .execute('GetRestaurantsByCuisine');
      if (result.recordset.length === 0) {
        return { success: false, message: 'No restaurants found for this cuisine' };
      }
      return { success: true, data: result.recordset };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Assign an admin to the restaurant
  assignAdmin: async ({ RestaurantID, UserID, TargetUserID }) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .input('UserID', sql.Int, UserID)
        .input('TargetUserID', sql.Int, TargetUserID)
        .execute('AssignRestaurantAdmin');
      return { success: true, message: 'Admin assigned successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Remove an admin from the restaurant
  removeAdmin: async ({ RestaurantID, UserID, TargetUserID }) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .input('UserID', sql.Int, UserID)
        .input('TargetUserID', sql.Int, TargetUserID)
        .execute('RemoveRestaurantAdmin');
      return { success: true, message: 'Admin removed successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Assign a staff member to the restaurant
  assignStaff: async ({ RestaurantID, UserID, TargetUserID }) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .input('UserID', sql.Int, UserID)
        .input('TargetUserID', sql.Int, TargetUserID)
        .execute('AssignRestaurantStaff');
      return { success: true, message: 'Staff assigned successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Remove a staff member from the restaurant
  removeStaff: async ({ RestaurantID, UserID, TargetUserID }) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .input('UserID', sql.Int, UserID)
        .input('TargetUserID', sql.Int, TargetUserID)
        .execute('RemoveRestaurantStaff');
      return { success: true, message: 'Staff removed successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Add an image to the restaurant
  addImage: async ({ RestaurantID, Image, UserID }) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .input('Image', sql.VarBinary(sql.MAX), Image)
        .input('UserID', sql.Int, UserID)
        .execute('AddRestaurantImage');
      return { success: true, message: 'Image added successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Delete an image from the restaurant
  deleteImage: async ({ RestaurantID, ImageID, UserID }) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .input('ImageID', sql.Int, ImageID)
        .input('UserID', sql.Int, UserID)
        .execute('DeleteRestaurantImage');
      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Fetch restaurant admins
  getRestaurantAdmins: async (RestaurantID) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .query(`
          SELECT U.UserID, U.Name, U.Email, U.PhoneNum  
          FROM Users U  
          JOIN RestaurantAdmins RA ON U.UserID = RA.UserID  
          WHERE RA.RestaurantID = @RestaurantID
        `);
      if (result.recordset.length === 0) {
        return { success: false, message: 'No admins found for this restaurant' };
      }
      return { success: true, data: result.recordset };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Fetch restaurant staff
  getRestaurantStaff: async (RestaurantID) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .query(`
          SELECT U.UserID, U.Name, U.Email, U.PhoneNum  
          FROM Users U  
          JOIN RestaurantStaff RS ON U.UserID = RS.UserID  
          WHERE RS.RestaurantID = @RestaurantID
        `);
      if (result.recordset.length === 0) {
        return { success: false, message: 'No staff found for this restaurant' };
      }
      return { success: true, data: result.recordset };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get images for a restaurant
  getRestaurantImages: async (RestaurantID) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, RestaurantID)
        .query(`SELECT Image FROM RestImages WHERE RestaurantID = @RestaurantID`);
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = RestaurantModel;
