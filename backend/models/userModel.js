const { sql, poolPromise } = require('../config/db');

const UserModel = {
  //Get all users
  getUsers: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query(`
            Select * from Users
        `);

        return result.recordset;
    } catch (error){
      throw new Error(error.message);
    }
  },

  //Get users by their id
  getUserById: async (id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("UserID", sql.Int, id)
            .query(`
                SELECT * FROM Users
                WHERE UserID = @UserID
            `);

        return result.recordset[0] || null;
    } catch (error) {
        throw new Error(error.message);
    }
  },

  //Register user
  createUser: async (userId, name, username, password, email, phoneNum, role) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .input('Name', sql.NVarChar, name)
        .input('Username', sql.NVarChar, username)
        .input('Password', sql.NVarChar, password)
        .input('Email', sql.NVarChar, email)
        .input('PhoneNum', sql.NVarChar, phoneNum)
        .input('Role', sql.NVarChar, role)
        .execute('RegisterUser');

      return { message: 'User created successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Delete User
  deleteUser: async (userId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .execute('DeleteUser');

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Update user info
  updateUser: async (userId, name, username, email, phoneNum) => {
    try {
      const pool = await poolPromise;
      
      const request = pool.request().input('UserID', sql.Int, userId);
  
      if (name) {
        request.input('Name', sql.NVarChar, name);
      }
      if (username) {
        request.input('Username', sql.NVarChar, username);
      }
      if (email) {
        request.input('Email', sql.NVarChar, email);
      }
      if (phoneNum) {
        request.input('PhoneNum', sql.NVarChar, phoneNum);
      }

      await request.execute('UpdateUser');
      
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Authenticate a user
  authenticateUser: async (username, password) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('Username', sql.NVarChar, username)
        .input('Password', sql.NVarChar, password)
        .execute('AuthenticateUser');

      return result.recordset[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Change user password
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .input('OldPassword', sql.NVarChar, oldPassword)
        .input('NewPassword', sql.NVarChar, newPassword)
        .execute('ChangePassword');

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get user reservations
  getUserReservations: async (userId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .execute('GetUserReservations');

      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .execute('GetUserReviews');

      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get restaurants managed by this user (admin)
  getMyRestaurants: async (userId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .query(`
          SELECT * FROM Restaurants
          JOIN RestaurantAdmins ON Restaurants.RestaurantID = RestaurantAdmins.RestaurantID
          WHERE RestaurantAdmins.UserID = @UserID
        `);

      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = UserModel;
