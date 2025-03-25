import { getConnection } from "../db/dbConnection.js";


const createOracleUser = async (userData) => {
    let connection;
    try {
      connection = await getConnection();
      
      // Generate SQL statements for user creation and privilege granting
      const sqlStatements = generateUserCreationSQL(userData);
      
      // Execute each SQL statement
      for (const sql of sqlStatements) {
        await connection.execute(sql);
      }
      
      await connection.commit();
      return { success: true, message: `User ${userData.username} created successfully` };
    } catch (err) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Error creating Oracle user:', err);
      return { success: false, message: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
}

const generateUserCreationSQL = (userData) => {
    const sqlStatements = [];
    
    // Create user
    sqlStatements.push(`CREATE USER ${userData.username} IDENTIFIED BY "${userData.password}"`);
    
    // Set account status
    const statusSql = userData.status === 'Active' 
      ? `ALTER USER ${userData.username} ACCOUNT UNLOCK` 
      : `ALTER USER ${userData.username} ACCOUNT LOCK`;
    sqlStatements.push(statusSql);
    
    // Grant basic privileges
    if (userData.basicPrivileges) {
      if (userData.basicPrivileges.CONNECT) {
        sqlStatements.push(`GRANT CONNECT TO ${userData.username}`);
      }
      if (userData.basicPrivileges.RESOURCE) {
        sqlStatements.push(`GRANT RESOURCE TO ${userData.username}`);
      }
      if (userData.basicPrivileges.CREATE_TABLE) {
        sqlStatements.push(`GRANT CREATE TABLE TO ${userData.username}`);
      }
    }
    
    // Grant table permissions
    if (userData.tablePermissions && userData.tablePermissions.length > 0) {
      userData.tablePermissions.forEach(tablePermission => {
        const { tableName, permissions } = tablePermission;
        
        const permissionTypes = [];
        if (permissions.SELECT) permissionTypes.push('SELECT');
        if (permissions.INSERT) permissionTypes.push('INSERT');
        if (permissions.UPDATE) permissionTypes.push('UPDATE');
        if (permissions.DELETE) permissionTypes.push('DELETE');
        
        if (permissionTypes.length > 0) {
          sqlStatements.push(`GRANT ${permissionTypes.join(', ')} ON ${tableName} TO ${userData.username}`);
        }
      });
    }
    
    return sqlStatements;
  }

const listOracleUsers = async () => {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT username, account_status, created FROM dba_users ORDER BY username`
      );
      return { success: true, data: result.rows };
    } catch (err) {
      console.error('Error listing Oracle users:', err);
      return { success: false, message: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
}

export default { createOracleUser, listOracleUsers };
