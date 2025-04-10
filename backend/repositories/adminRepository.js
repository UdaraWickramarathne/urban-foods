import { getConnection } from "../db/dbConnection.js";
import { hashPassword, verifyPassword } from "../utils/passwordUtils.js";
import User from "../models/user.js";
import auth from "../middlewares/auth.js";
import { ADMIN_PERMISSIONS, DB_PRIVILEGE_MAP } from "../enums/permissions.js";
import DbUser from "../models/dbUser.js";
import Trigger from "../models/trigger.js";

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

    await connection.execute(
      "INSERT INTO users (username, password, role) VALUES (:1, :2, :3)",
      [userData.username, hashedPassword, "admin"]
    );

    await connection.commit();
    return {
      success: true,
      message: `User ${userData.username} created successfully`,
    };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error creating Oracle user:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

const generateUserCreationSQL = (userData) => {
  console.log(userData);
  const sqlStatements = [];

  // Create user
  sqlStatements.push(
    `CREATE USER ${userData.username} IDENTIFIED BY "${userData.password}"`
  );

  // Set account accoutStatus
  const statusSql =
    userData.status === "Active"
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
    userData.tablePermissions.forEach((tablePermission) => {
      const { tableName, permissions } = tablePermission;

      const permissionTypes = [];
      if (permissions.SELECT) permissionTypes.push("SELECT");
      if (permissions.INSERT) permissionTypes.push("INSERT");
      if (permissions.UPDATE) permissionTypes.push("UPDATE");
      if (permissions.DELETE) permissionTypes.push("DELETE");

      if (permissionTypes.length > 0) {
        sqlStatements.push(
          `GRANT ${permissionTypes.join(", ")} ON ${tableName} TO ${
            userData.username
          }`
        );
      }
    });
  }

  return sqlStatements;
};

const listOracleUsers = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT username, account_status, created FROM dba_users ORDER BY username`
    );
    return { success: true, data: result.rows };
  } catch (err) {
    console.error("Error listing Oracle users:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

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

    // Check account accoutStatus
    const accountStatusResult = await getAccountStatus(username);
    if (!accountStatusResult.success) {
      return {
        success: false,
        message: accountStatusResult.message,
      };
    }
    if (accountStatusResult.data !== "OPEN") {
      return {
        success: false,
        message: "Account is locked or expired",
      };
    }

    const token = generateToken(user.userId, user.role);

    if (username === process.env.DB_USER) {
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
    const permissions = mapDbPrivilegesToPermissionsList(
      permissionsResult.rows
    );

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
      "SELECT username FROM users WHERE user_id = :userId",
      { userId: userId }
    );

    const username = usernameResult.rows[0][0];

    if (username === process.env.DB_USER) {
      return { success: true, data: ADMIN_PERMISSIONS };
    }

    const tbPermisionsResult = await connection.execute(
      `SELECT TABLE_NAME, PRIVILEGE 
       FROM DBA_TAB_PRIVS 
       WHERE GRANTEE = :username`,
      { username: username.toUpperCase() }
    );

    const basicPrivilegesResult = await connection.execute(
      `SELECT PRIVILEGE FROM DBA_SYS_PRIVS
      WHERE GRANTEE = :username`,
      { username: username.toUpperCase() }
    );

    // Extract basic privileges
    const basicPrivileges = basicPrivilegesResult.rows.map((row) => row[0]);

    const basicPermissions = basicPrivileges.map((privilege) => {
      return privilege.replace(/\s+/g, "_");
    });

    // Map database privileges to application permissions
    const permissions = mapDbPrivilegesToPermissionsList(
      tbPermisionsResult.rows
    );

    return {
      success: true,
      permissions: permissions,
      basicPermissions: basicPermissions,
    };
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
};

// Helper function to map database privileges to application permissions list
const mapDbPrivilegesToPermissionsList = (privilegesRows) => {
  const permissions = [];

  privilegesRows.forEach((row) => {
    const tableName = row[0]; // TABLE_NAME
    const privilege = row[1]; // PRIVILEGE

    const permissionType = DB_PRIVILEGE_MAP[privilege];
    if (!permissionType) return; // Skip if privilege doesn't map to a known type

    // Map permissions for all tables
    const tables = {
      CUSTOMERS: "CUSTOMERS",
      PRODUCTS: "PRODUCTS",
      CATEGORIES: "CATEGORIES",
      USERS: "USERS",
      SUPPLIERS: "SUPPLIERS",
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

const getAccountStatus = async (username) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT account_status FROM dba_users WHERE username = :username`,
      { username: username.toUpperCase() }
    );

    if (result.rows.length === 0) {
      return { success: false, message: "User Not Found" }; // User not found
    }

    return { success: true, data: result.rows[0][0] }; // Return account accoutStatus
  } catch (error) {
    console.error("Error fetching account accoutStatus:", error.message);
    return { success: false, message: "Error fetching account accoutStatus" };
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

const getAllDbUsers = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT username, created, account_status FROM dba_users  
        WHERE username IN (SELECT UPPER(username) FROM users WHERE role = 'admin') ORDER BY created ASC`
    );

    const users = result.rows.map((row) =>
      DbUser.fromDbRow(row, result.metaData)
    );
    return { success: true, data: users };
  } catch (err) {
    console.error("Error listing Oracle users:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

// Helper function to get current user privileges
const getCurrentUserPrivileges = async (username) => {
  let connection;
  try {
    connection = await getConnection();
    // Get basic privileges
    const basicPrivsResult = await connection.execute(
      `SELECT PRIVILEGE FROM DBA_SYS_PRIVS WHERE GRANTEE = :username`,
      { username: username.toUpperCase() }
    );

    const basicPrivileges = {
      SESSION: false,
      CREATE_VIEW: false,
      CREATE_TABLE: false,
    };

    basicPrivsResult.rows.forEach((row) => {
      if (row[0] === "CREATE SESSION") basicPrivileges.SESSION = true;
      if (row[0] === "CREATE VIEW") basicPrivileges.CREATE_VIEW = true;
      if (row[0] === "CREATE TABLE") basicPrivileges.CREATE_TABLE = true;
    });

    // Get table permissions
    const tablePrivsResult = await connection.execute(
      `SELECT TABLE_NAME, PRIVILEGE FROM DBA_TAB_PRIVS WHERE GRANTEE = :username`,
      { username: username.toUpperCase() }
    );

    const tablePermissions = [];
    const tablePermMap = {};

    tablePrivsResult.rows.forEach((row) => {
      const tableName = row[0];
      const privilege = row[1];

      if (!tablePermMap[tableName]) {
        tablePermMap[tableName] = {
          tableName,
          permissions: {
            SELECT: false,
            INSERT: false,
            UPDATE: false,
            DELETE: false,
          },
        };
        tablePermissions.push(tablePermMap[tableName]);
      }

      if (privilege === "SELECT")
        tablePermMap[tableName].permissions.SELECT = true;
      if (privilege === "INSERT")
        tablePermMap[tableName].permissions.INSERT = true;
      if (privilege === "UPDATE")
        tablePermMap[tableName].permissions.UPDATE = true;
      if (privilege === "DELETE")
        tablePermMap[tableName].permissions.DELETE = true;
    });

    return {
      basicPrivileges,
      tablePermissions,
    };
  } catch (error) {
    console.error("Error fetching current privileges:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

// Function to generate SQL statements for permission updates
const generateUpdatePermissionsSQL = (username, currentPerms, newPerms) => {
  const sqlStatements = [];

  // Update account accoutStatus if needed
  if (newPerms.accoutStatus) {
    const statusSql =
      newPerms.accoutStatus === "OPEN"
        ? `ALTER USER ${username} ACCOUNT UNLOCK`
        : `ALTER USER ${username} ACCOUNT LOCK`;
    sqlStatements.push(statusSql);
  }

  // Update password if provided
  if (newPerms.password) {
    sqlStatements.push(
      `ALTER USER ${username} IDENTIFIED BY "${newPerms.password}"`
    );
  }

  // Update basic privileges
  if (newPerms.permissions.basicPrivileges) {
    // Grant new privileges
    if (
      newPerms.permissions.basicPrivileges.SESSION &&
      !currentPerms.basicPrivileges.SESSION
    ) {
      sqlStatements.push(`GRANT CREATE SESSION TO ${username}`);
    }
    if (
      newPerms.permissions.basicPrivileges.CREATE_VIEW &&
      !currentPerms.basicPrivileges.CREATE_VIEW
    ) {
      sqlStatements.push(`GRANT CREATE VIEW TO ${username}`);
    }
    if (
      newPerms.permissions.basicPrivileges.CREATE_TABLE &&
      !currentPerms.basicPrivileges.CREATE_TABLE
    ) {
      sqlStatements.push(`GRANT CREATE TABLE TO ${username}`);
    }

    // Revoke removed privileges
    if (
      !newPerms.permissions.basicPrivileges.SESSION &&
      currentPerms.basicPrivileges.SESSION
    ) {
      sqlStatements.push(`REVOKE CREATE SESSION FROM ${username}`);
    }
    if (
      !newPerms.permissions.basicPrivileges.CREATE_VIEW &&
      currentPerms.basicPrivileges.CREATE_VIEW
    ) {
      sqlStatements.push(`REVOKE CREATE VIEW FROM ${username}`);
    }
    if (
      !newPerms.permissions.basicPrivileges.CREATE_TABLE &&
      currentPerms.basicPrivileges.CREATE_TABLE
    ) {
      sqlStatements.push(`REVOKE CREATE TABLE FROM ${username}`);
    }
  }

  // Update table permissions
  if (newPerms.permissions.tablePermissions) {
    const currentTableMap = {};
    currentPerms.tablePermissions.forEach((tp) => {
      currentTableMap[tp.tableName] = tp.permissions;
    });
    
    // Track which tables are processed in the new permissions
    const processedTables = new Set();
    
    newPerms.permissions.tablePermissions.forEach((tp) => {
      const tableName = tp.tableName;
      processedTables.add(tableName);
      const newPermissions = tp.permissions;
      const currentPermissions = currentTableMap[tableName] || {
        SELECT: false,
        INSERT: false,
        UPDATE: false,
        DELETE: false,
      };

      // Collect permissions to grant
      const toGrant = [];
      if (newPermissions.SELECT && !currentPermissions.SELECT)
        toGrant.push("SELECT");
      if (newPermissions.INSERT && !currentPermissions.INSERT)
        toGrant.push("INSERT");
      if (newPermissions.UPDATE && !currentPermissions.UPDATE)
        toGrant.push("UPDATE");
      if (newPermissions.DELETE && !currentPermissions.DELETE)
        toGrant.push("DELETE");

      if (toGrant.length > 0) {
        sqlStatements.push(
          `GRANT ${toGrant.join(", ")} ON ${tableName} TO ${username}`
        );
      }

      // Collect permissions to revoke
      const toRevoke = [];
      if (!newPermissions.SELECT && currentPermissions.SELECT)
        toRevoke.push("SELECT");
      if (!newPermissions.INSERT && currentPermissions.INSERT)
        toRevoke.push("INSERT");
      if (!newPermissions.UPDATE && currentPermissions.UPDATE)
        toRevoke.push("UPDATE");
      if (!newPermissions.DELETE && currentPermissions.DELETE)
        toRevoke.push("DELETE");

      if (toRevoke.length > 0) {
        sqlStatements.push(
          `REVOKE ${toRevoke.join(", ")} ON ${tableName} FROM ${username}`
        );
      }
    });
    
    Object.keys(currentTableMap).forEach(tableName => {
      if (!processedTables.has(tableName)) {
        const currentPermissions = currentTableMap[tableName];
        const toRevoke = [];
        
        if (currentPermissions.SELECT) toRevoke.push("SELECT");
        if (currentPermissions.INSERT) toRevoke.push("INSERT");
        if (currentPermissions.UPDATE) toRevoke.push("UPDATE");
        if (currentPermissions.DELETE) toRevoke.push("DELETE");
        
        if (toRevoke.length > 0) {
          sqlStatements.push(
            `REVOKE ${toRevoke.join(", ")} ON ${tableName} FROM ${username}`
          );
        }
      }
    });
  }

  console.log("Generated SQL statements:", sqlStatements);
  
  return sqlStatements;
};

const updateDbUser = async (userData) => {
  let connection;
  try {
    connection = await getConnection();

    // Fetch current user privileges
    const currentPrivileges = await getCurrentUserPrivileges(
      userData.username
    );

    // Generate SQL statements for permission updates
    const sqlStatements = generateUpdatePermissionsSQL(
      userData.username,
      currentPrivileges,
      userData
    );

    // Execute each SQL statement
    for (const sql of sqlStatements) {
      await connection.execute(sql);
    }

    // Update password in application users table if provided
    if (userData.password) {
      const hashedPassword = await hashPassword(userData.password);
      await connection.execute(
        "UPDATE users SET password = :1 WHERE username = :2",
        [hashedPassword, userData.username]
      );
    }

    await connection.commit();
    return {
      success: true,
      message: `User ${userData.username} updated successfully`,
    };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error updating Oracle user:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

const deleteDbUser = async (username) => {
  let connection;
  try {
    connection = await getConnection();

    // Drop the Oracle user
    await connection.execute(`DROP USER ${username} CASCADE`);

    // Delete the user from the application users table
    const deleteResult = await connection.execute(
      "DELETE FROM users WHERE username = :username",
      { username: username.toLowerCase() }  
    );

    console.log("Delete result:", deleteResult);

    await connection.commit();
    return {
      success: true,
      message: `User ${username} deleted successfully`,
    };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error deleting Oracle user:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}
const getAllTriggers = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT TRIGGER_NAME, TABLE_NAME, TRIGGER_TYPE, TRIGGERING_EVENT, STATUS, TRIGGER_BODY
        FROM DBA_TRIGGERS WHERE OWNER = 'URBANFOOD_USER'`
    );
    const triggers = result.rows.map((row) => Trigger.fromDbRow(row, result.metaData));
    return { success: true, data: triggers };
  } catch (err) {
    console.error("Error listing Oracle triggers:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }

}

const getLogDetails = async (tableName) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM ${tableName}`
    );
    // I want to return column names as well
    const columns = result.metaData.map((col) => col.name);
    return { success: true, rows: result.rows, columns: columns };
  } catch (err) {
    console.error("Error listing Oracle triggers:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

const dropTrigger = async (triggerName) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(`DROP TRIGGER ${triggerName}`);
    await connection.commit();
    return { success: true, message: `Trigger ${triggerName} deleted successfully` };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error deleting Oracle trigger:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

const changeTriggerStatus = async (triggerName, status) => {
  let connection;
  try {
    connection = await getConnection();
    const sql = `ALTER TRIGGER ${triggerName} ${status}`;
    await connection.execute(sql);
    await connection.commit();
    return { success: true, message: `Trigger ${triggerName} status changed to ${status}` };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error changing trigger status:", err);
    return { success: false, message: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}
export default {
  createOracleUser,
  listOracleUsers,
  login,
  getUserPermissions,
  getAccountStatus,
  getAllDbUsers,
  updateDbUser,
  getCurrentUserPrivileges,
  deleteDbUser,
  getAllTriggers,
  getLogDetails,
  dropTrigger,
  changeTriggerStatus
};
