import fs from 'fs';
import path from 'path';
import { getConnection } from '../db/dbConnection.js';


const backupDir = path.join(process.cwd(), 'backups');
const getAllBackups = async () => {
  let connection;
  try {
    connection = await getConnection();

    const isBacupTableExists = await connection.execute(
      `SELECT COUNT(*) FROM user_tables WHERE table_name = 'DB_BACKUPS'`
    );

    if (isBacupTableExists.rows[0][0] === 0) {
        return {
            success: false,
            message: 'No backup records found',
            data: []
        };
    }
    
    const result = await connection.execute(
      `SELECT * FROM db_backups ORDER BY created_at DESC`
    );
    
    return {
      success: true,
      data: result.rows.map(row => ({
        id: row[0],
        fileName: row[1],
        size: row[2],
        status: row[3],
        createdAt: row[4]
      }))
    };
  } catch (error) {
    console.error('Error retrieving backups:', error);
    return {
      success: false,
      message: `Failed to retrieve backups: ${error.message}`
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

const downloadBackup = (backupId) => {
  return new Promise(async (resolve, reject) => {
    let connection;
    try {
      connection = await getConnection();
      
      // Get backup file name from database
      const result = await connection.execute(
        `SELECT file_name FROM db_backups WHERE backup_id = :backupId`,
        { backupId }
      );
      
      if (result.rows.length === 0) {
        return reject({
          success: false,
          message: 'Backup not found'
        });
      }
      
      const fileName = result.rows[0][0];
      const filePath = path.join(backupDir, fileName);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return reject({
          success: false,
          message: 'Backup file not found on disk'
        });
      }
      
      resolve({
        success: true,
        filePath,
        fileName
      });
    } catch (error) {
      console.error('Error downloading backup:', error);
      reject({
        success: false,
        message: `Failed to download backup: ${error.message}`
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  });
};

export default {
    getAllBackups,
    downloadBackup
}