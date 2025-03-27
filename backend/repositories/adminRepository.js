import { getConnection } from "../db/dbConnection.js";
import { hashPassword, verifyPassword } from "../utils/passwordUtils.js";
import User from "../models/user.js";
import auth from "../middlewares/auth.js";
import { ADMIN_PERMISSIONS, DB_PRIVILEGE_MAP } from "../enums/permissions.js";

const { generateToken } = auth;



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

      const hashedPassword = await hashPassword(userData.password);

      await connection.execute('INSERT INTO users (username, password, role) VALUES (:1, :2, :3)', [userData.username, hashedPassword, 'admin']);
      
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
      if (userData.basicPrivileges.SESSION) {
        sqlStatements.push(`GRANT CREATE SESSION TO ${userData.username}`);
      }
      if (userData.basicPrivileges.CREATE_VIEW) {
        sqlStatements.push(`GRANT CREATE VIEW TO ${userData.username}`);
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

const login = async ({ username, password }) => {
  if (!username || !password) {
    return {
      success: false,
      message: "Username and password are required",
    };
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      "SELECT * FROM users WHERE username = :username",
      {
        username: username,
      }
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    const user = User.fromDbRow(result.rows[0], result.metaData);
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }
    const token = generateToken(user.userId, user.role);

    if(username === process.env.DB_USER){
      return {
        token: token,
        userId: user.userId,
        role: user.role,
        permissions: ADMIN_PERMISSIONS,
        success: true,
        message: "Login successful",
      };
    }

    // Fetch user permissions from DBA_TAB_PRIVS
    const permissionsResult = await connection.execute(
      `SELECT TABLE_NAME, PRIVILEGE 
       FROM DBA_TAB_PRIVS 
       WHERE GRANTEE = :username`,
      { username: username.toUpperCase() }
    );

    // Map database privileges to application permissions
    const permissions = mapDbPrivilegesToPermissionsList(permissionsResult.rows);

    return {
      token: token,
      userId: user.userId,
      role: user.role,
      permissions: permissions,
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error.message);
    return {
      success: false,
      message: "Error during login process",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};


const getUserPermissions = async (userId) => {
  let connection;
  try {
    connection = await getConnection();
    
    const usernameResult = await connection.execute(
      'SELECT username FROM users WHERE user_id = :userId',
      { userId: userId }
    );

    const username = usernameResult.rows[0][0];

    if(username === process.env.DB_USER){
      return { success: true, data: ADMIN_PERMISSIONS };
    }

    
    const result = await connection.execute(
      `SELECT TABLE_NAME, PRIVILEGE 
       FROM DBA_TAB_PRIVS 
       WHERE GRANTEE = :username`,
      { username: username.toUpperCase() }
    );

    console.log(result.rows);
    
    // Map database privileges to application permissions
    const permissions = mapDbPrivilegesToPermissionsList(result.rows);

    return { success: true, data: permissions };
  } catch (error) {
    console.log("Error getting user permissions:", error.message);
    return { success: false, message: "Error getting user permissions" };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
}

// Helper function to map database privileges to application permissions list
const mapDbPrivilegesToPermissionsList = (privilegesRows) => {
  const permissions = [];
  
  privilegesRows.forEach(row => {
    const tableName = row[0]; // TABLE_NAME
    const privilege = row[1]; // PRIVILEGE
    
    const permissionType = DB_PRIVILEGE_MAP[privilege];
    if (!permissionType) return; // Skip if privilege doesn't map to a known type
    
    // Map permissions for all tables
    const tables = {
      'CUSTOMERS': 'CUSTOMERS',
      'PRODUCTS': 'PRODUCTS', 
      'CATEGORIES': 'CATEGORIES',
      'USERS': 'USERS',
      'SUPPLIERS': 'SUPPLIERS'
    };
    
    const tableConstant = tables[tableName];
    if (tableConstant) {
      const permissionKey = `${permissionType}_${tableConstant}`;
      if (!permissions.includes(permissionKey)) {
        permissions.push(permissionKey);
      }
    }
  });
  
  return permissions;
};

export default { createOracleUser, listOracleUsers, login, getUserPermissions };
