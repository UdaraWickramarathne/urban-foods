import config from './config.js';
import oracledb from 'oracledb';

// Set Oracle client configuration
oracledb.autoCommit = true;

const dbConfig = {
  user: config.db.user,
  password: config.db.password,
  connectString: config.db.connectString
};

// Helper function to get connection
const getConnection = async () => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

export { dbConfig, getConnection };