const { sql, poolPromise } = require('../config/db');

const UserModel = {
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

  getUserById: async (id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("Userid", sql.Int, id)
            .query(`
                SELECT * FROM Users
                WHERE UserID = @Userid
            `);
        return result.recordset[0] || null;
    } catch (error) {
        throw new Error(error.message);
    }
  },

  createUser: async (name, username, password, email, phoneNum, role) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('Name', sql.NVarChar, name)
        .input('Username', sql.NVarChar, username)
        .input('Password', sql.NVarChar, password)
        .input('Email', sql.NVarChar, email)
        .input('PhoneNum', sql.NVarChar, phoneNum)
        .input('Role', sql.NVarChar, role)
        .query(`
          INSERT INTO Users (Name, Username, Password, Email, PhoneNum, Role)
          VALUES (@Name, @Username, @Password, @Email, @PhoneNum, @Role)
        `);
      return { message: 'User created successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = UserModel;
