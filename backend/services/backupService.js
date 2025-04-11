import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import config from '../db/config.js';
import { getConnection } from '../db/dbConnection.js';
import oracledb from 'oracledb';

// Convert exec to promise-based function
const execPromise = util.promisify(exec);

// Create backup directory if it doesn't exist
const backupDir = path.join(process.cwd(), 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const createBackup = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.dmp`;
    const logFileName = `backup-${timestamp}.log`;
    
    // Extract connection details
    const { user, password, connectString } = config.db;
    
    // Form the expdp command for Oracle Data Pump export
    const command = `expdp ${user}/${password}@${connectString} DIRECTORY=DATA_PUMP_DIR DUMPFILE=${backupFileName} LOGFILE=${logFileName} SCHEMAS=URBANFOOD_USER EXCLUDE=STATISTICS`;
    
    console.log('Starting database backup...');
    const { stdout, stderr } = await execPromise(command);
    
    console.log('expdp command completed');
    
    // Use the known Oracle backup directory path instead of parsing the output
    const oracleBackupDir = 'C:\\app\\udara\\product\\23ai\\admin\\FREE\\dpdump\\6D8B30C1392840A39A292EBAEC0C8455';
    const oracleBackupPath = path.join(oracleBackupDir, backupFileName);
    
    try {
      console.log(`Looking for backup file at: ${oracleBackupPath}`);
      
      // Check if the file exists before copying
      if (fs.existsSync(oracleBackupPath)) {
        console.log(`Found backup file at: ${oracleBackupPath}`);
        
        // Copy the file to our backup directory
        const localBackupPath = path.join(backupDir, backupFileName);
        fs.copyFileSync(oracleBackupPath, localBackupPath);
        console.log(`Copied backup file to: ${localBackupPath}`);
        
        // Get actual file size
        const stats = fs.statSync(localBackupPath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        // Save backup record to database with actual size
        const backupRecord = await saveBackupRecord(backupFileName, `${fileSizeInMB} MB`);
        
        console.log('Database backup completed successfully');
        return {
          success: true,
          backupId: backupRecord.backupId,
          fileName: backupFileName,
          size: `${fileSizeInMB} MB`,
          createdAt: new Date().toISOString(),
          message: 'Database backup completed successfully'
        };
      } else {
        console.warn(`Backup file not found at: ${oracleBackupPath}`);
        // Try to list files in the directory to debug
        try {
          const files = fs.readdirSync(oracleBackupDir);
          console.log(`Files in Oracle backup directory: ${files.join(', ')}`);
        } catch (dirError) {
          console.error(`Cannot read directory: ${dirError.message}`);
        }
        
        // Save backup record with unknown size
        const backupRecord = await saveBackupRecord(backupFileName, "Unknown (file not found)");
        
        return {
          success: true,
          backupId: backupRecord.backupId,
          fileName: backupFileName,
          size: "Unknown (file not found)",
          createdAt: new Date().toISOString(),
          message: 'Database backup completed but file not found at expected location'
        };
      }
    } catch (fileError) {
      console.error(`Error handling backup file: ${fileError.message}`);
      
      // Save backup record with unknown size
      const backupRecord = await saveBackupRecord(backupFileName, "Unknown (error)");
      
      return {
        success: true,
        backupId: backupRecord.backupId,
        fileName: backupFileName,
        size: "Unknown (error)",
        createdAt: new Date().toISOString(),
        message: `Database backup completed but error accessing file: ${fileError.message}`
      };
    }
  } catch (error) {
    console.error('Error creating database backup:', error);
    return {
      success: false,
      message: `Backup failed: ${error.message}`
    };
  }
};

// Save backup record to database
const saveBackupRecord = async (fileName, size) => {
  let connection;
  try {
    connection = await getConnection();
    
    // Create a database table to store backup records if it doesn't exist
    await connection.execute(`
      DECLARE
        table_exists NUMBER;
      BEGIN
        SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'DB_BACKUPS';
        IF table_exists = 0 THEN
          EXECUTE IMMEDIATE 'CREATE TABLE db_backups (
            backup_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            file_name VARCHAR2(255) NOT NULL,
            file_size VARCHAR2(50) NOT NULL,
            status VARCHAR2(50) DEFAULT ''Completed'',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )';
        END IF;
      END;
    `);
    
    // Insert backup record
    const result = await connection.execute(
      `INSERT INTO db_backups (file_name, file_size) 
       VALUES (:fileName, :fileSize) 
       RETURNING backup_id INTO :backupId`,
      {
        fileName: fileName,
        fileSize: size,
        backupId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );
    
    return {
      backupId: result.outBinds.backupId[0],
      fileName: fileName,
      size: size
    };
  } catch (error) {
    console.error('Error saving backup record:', error);
    throw error;
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

export default {
  createBackup
};