import adminRepository from "../repositories/adminRepository";

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

export default { addOrcleUser };