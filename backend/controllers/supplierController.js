import HttpStatus from '../enums/httpsStatus.js';
import supplierRepository from '../repositories/supplierRepository.js';

const getAllSuppliersWithDetails = async (req, res) => {
    try {
        const result = await supplierRepository.getAllSuppliersWithDetails();
        if (result.success) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Suppliers retrieved successfully",
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
            message: "Failed to retrieve suppliers"
        });
    }
}

const updateSupplier = async (req, res) => {
    try {
        const supplierId = req.params.supplierId;
        const supplier = req.body;
        const result = await supplierRepository.updateSupplier(supplierId, supplier);

        if (result.success) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Supplier updated successfully"
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
            message: "Error updating supplier"
        });
    }
}

const deleteSupplier = async (req, res) => {
    try {
        const supplierId = req.params.supplierId;
        const result = await supplierRepository.deleteSupplier(supplierId);

        if (result.success) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Supplier deleted successfully"
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
            message: "Error deleting supplier"
        });
    }
}

const  addSupplier = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.filename : null;
        const supplier = req.body;
        supplier.imageUrl = imageUrl;
        const result = await supplierRepository.addSupplier(supplier);

        if (result.success) {
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Supplier added successfully",
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
            message: "Error adding supplier"
        });
    }
}
export default { getAllSuppliersWithDetails, updateSupplier, deleteSupplier, addSupplier };