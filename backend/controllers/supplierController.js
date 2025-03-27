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

export default { getAllSuppliersWithDetails };