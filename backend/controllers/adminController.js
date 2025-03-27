import adminRepository from "../repositories/adminRepository.js";
import HttpStatus from "../enums/httpsStatus.js";


const addOrcleUser = async (req, res) => {
    try {
        const userData = req.body;
        const result = await adminRepository.createOracleUser(userData);

        if (result.success) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "User added successfully",
                data: result.data
            });
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error adding user",
        });
    }
}

const adminLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
  
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

const  getUserPermissions = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await adminRepository.getUserPermissions(userId);

        if (result.success) {
            res.status(HttpStatus.OK).json({
                success: true,
                data: result.data
            });
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error getting user permissions",
        });
    }
}

export default { addOrcleUser, adminLogin, getUserPermissions };