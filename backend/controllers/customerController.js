import HttpStatus from "../enums/httpsStatus.js";
import customerRepository from "../repositories/customerRepository.js";

const editCustomer = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const customerData = req.body;
      
      const result = await customerRepository.editCustomer(customerId, customerData);

      if (result.success) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Customer updated successfully",
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
        message: "Error updating customer",
      });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const result = await customerRepository.deleteCustomer(customerId);

        if (result.success) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Customer deleted successfully"
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
            message: "Error deleting customer"
        });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const result = await customerRepository.getCustomerById(customerId);
        
        if (result) {
            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Customer not found'
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving customer"
        });
    }
};

const getCustomers = async (req, res) => {
    try {
        const customers = await customerRepository.getAllCustomers();

        if (customers) {
            res.status(HttpStatus.OK).json({
                success: true,
                data: customers
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "No customers found"
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving customers"
        });
    }
}

const getCustomersWithSpends = async (req, res) => {
    try {
        const result = await customerRepository.getCustomersWithTotalSpends();
        
        if (result.success) {
            res.status(HttpStatus.OK).json({
                success: true,
                data: result.data
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "No customer spending data found"
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving customer spending data",
            error: error.message
        });
    }
}

export default { editCustomer, deleteCustomer, getCustomerById, getCustomers, getCustomersWithSpends };