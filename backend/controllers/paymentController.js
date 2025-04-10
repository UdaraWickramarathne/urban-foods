import HttpStatus from "../enums/httpsStatus.js";
import paymentRepository from "../repositories/paymentRepository.js";

const updateCardPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.body;
        const result = await paymentRepository.updateCardPaymentStatus(orderId, "PAID");
        if (result.success) {
            res.status(HttpStatus.OK).json({ success: true, message: "Payment status updated successfully" });
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error updating payment status" });
        }
    } catch (error) {
        console.error("Error updating payment status:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error updating payment status" });
    }
}

export default {
    updateCardPaymentStatus,
};