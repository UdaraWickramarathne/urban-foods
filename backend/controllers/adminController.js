import adminRepository from "../repositories/adminRepository.js";
import HttpStatus from "../enums/httpsStatus.js";
import getAffectedTables from "../services/logService.js";

const addOrcleUser = async (req, res) => {
  try {
    const userData = req.body;
    // Basic validation
    if (!userData.username || !userData.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const result = await adminRepository.createOracleUser(userData);

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "User added successfully",
        data: result.data,
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error adding user",
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login request:", req.body);

    // Basic validation
    if (!username || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const result = await adminRepository.login({ username, password });

    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred during login",
      });
    }

    if (!result.success) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      message: result.message,
      token: result.token,
      permissions: result.permissions,
      userId: result.userId,
      role: result.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error logging in",
    });
  }
};

const getUserPermissions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await adminRepository.getUserPermissions(userId);    
    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting user permissions",
    });
  }
};

const getCurrentPermissions = async (req, res) => {
  try {
    const username = req.params.username;
    const result = await adminRepository.getCurrentUserPrivileges(username);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        tablePermissions: result.tablePermissions,
        basicPrivileges: result.basicPrivileges,
      },
    });
  } catch (error) {
    console.log("Error getting all permissions:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting all permissions",
    });
  }
};

const getAccountStatus = async (req, res) => {
  try {
    const username = req.params.username;
    const result = await adminRepository.getAccountStatus(username);

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting account status",
    });
  }
};

const getAllDbUsers = async (req, res) => {
  try {
    const result = await adminRepository.getAllDbUsers();

    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting all users",
    });
  }
};

const updateDbUser = async (req, res) => {
  try {
    const userData = req.body;
    // Basic validation
    if (!userData.username) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Username is required",
      });
    }

    const result = await adminRepository.updateDbUser(userData);

    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User updated successfully",
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.log("Error updating user:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating user",
    });
  }
};

const deleteDbUser = async (req, res) => {
  try {
    const username = req.params.username;
    const result = await adminRepository.deleteDbUser(username);

    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.log("Error deleting user:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting user",
    });
  }
}

const getAllTrigger = async (req, res) => {
  try {
    const result = await adminRepository.getAllTriggers();

    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.log("Error getting all triggers:", error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting all triggers",
    });
  }
}

const getLogDetails = async (req, res) => {
  try {
    const trigger = req.body; // Assuming the trigger is passed as a query parameter
    const affectedTables = getAffectedTables(trigger.triggerBody);
    
    if (affectedTables.length === 0) {
      affectedTables.push(trigger.tableName);
    }
    const result = await adminRepository.getLogDetails(affectedTables[0]);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        rows: result.rows,
        columns: result.columns,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.log("Error getting log details:", error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting log details",
    });
  }
}

const dropTrigger = async (req, res) => {
  try {
    const triggerName = req.params.triggerName;
    const result = await adminRepository.dropTrigger(triggerName);

    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.log("Error dropping trigger:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error dropping trigger",
    });
  }
};

const changeTriggerStatus = async (req, res) => {
  try {
    const triggerName = req.params.triggerName;
    const status = req.body.status; // Assuming the status is passed in the request body
    const result = await adminRepository.changeTriggerStatus(triggerName, status);

    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.log("Error changing trigger status:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error changing trigger status",
    });
  }
}


export default {
  addOrcleUser,
  adminLogin,
  getUserPermissions,
  getAccountStatus,
  getAllDbUsers,
  getCurrentPermissions,
  updateDbUser,
  deleteDbUser,
  getAllTrigger,
  getLogDetails,
  dropTrigger,
  changeTriggerStatus
};
