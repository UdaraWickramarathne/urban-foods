import { getConnection } from "../db/dbConnection.js";
import oracledb from "oracledb";


const addPayment = async (paymentData) => {
    const connection = await getConnection();
    try {
        const result = await connection.execute(
            "INSERT INTO payments (order_id, payment_method, amount, status) VALUES (:orderId, :paymentMethod, :amount, :status) RETURNING payment_id INTO :paymentId",
            {
                orderId: paymentData.orderId,
                paymentMethod: paymentData.paymentMethod,
                amount: paymentData.amount,
                status: paymentData.status,
                paymentId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            }
        );
        await connection.commit();
        return { success: true, paymentId: result.outBinds.paymentId[0] };
    } catch (error) {
        console.error("Error:", error.message);
        return { success: false, message: error.message };
    } finally {
        await connection.close();
    }
};


const updateCardPaymentStatus = async (orderId, paymentStatus) => {
    const connection = await getConnection();
    try {
        const result = await connection.execute(
            "UPDATE payments SET status = :status WHERE order_id = :orderId AND payment_method = 'CARD'",
            {
                status: paymentStatus,
                orderId: orderId,
            }
        );
        await connection.commit();
        return { success: true };
    } catch (error) {
        console.error("Error:", error.message);
        return { success: false, message: error.message };
    } finally {
        await connection.close();
    }
}

export default { addPayment, updateCardPaymentStatus };