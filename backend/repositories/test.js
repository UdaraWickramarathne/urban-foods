// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { execute } = require('../db');
const { generateAuthToken } = require('../utils/auth');

router.post('/register/customer', async (req, res) => {
  const { 
    username, 
    password, 
    email, 
    first_name, 
    last_name, 
    address 
  } = req.body;

  // Validate input
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let connection;
  try {
    // Start transaction
    connection = await oracledb.getConnection();
    await connection.execute(`BEGIN TRANSACTION`);

    // 1. Insert into Users table
    const hashedPassword = await bcrypt.hash(password, 10);
    const userSql = `
      INSERT INTO Users (username, password_hash, role) 
      VALUES (:username, :password, 'customer') 
      RETURNING user_id INTO :user_id
    `;

    const userBinds = {
      username,
      password: hashedPassword,
      user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const userResult = await connection.execute(userSql, userBinds);
    const userId = userResult.outBinds.user_id[0];

    // 2. Insert into Customers table
    const customerSql = `
      INSERT INTO Customers (customer_id, email, first_name, last_name, address)
      VALUES (:user_id, :email, :first_name, :last_name, :address)
    `;

    const customerBinds = {
      user_id: userId,
      email,
      first_name,
      last_name,
      address
    };

    await connection.execute(customerSql, customerBinds);

    // Commit transaction
    await connection.commit();

    // Generate JWT
    const token = generateAuthToken(userId, 'customer');

    res.status(201).json({ 
      message: 'Registration successful',
      user_id: userId,
      token
    });

  } catch (err) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }

    // Handle unique constraint violation
    if (err.errorNum === 1) { // Oracle unique constraint error code
      return res.status(409).json({ error: 'Username already exists' });
    }

    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});