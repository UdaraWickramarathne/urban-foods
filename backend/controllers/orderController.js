import HttpStatus from "../enums/httpsStatus.js";
import orderRepository from "../repositories/orderRepository.js";

const getOrders = async (req, res) => {
    const orders = await orderRepository.getAllOrders();
    res.status(HttpStatus.OK).json(orders);
};

const getOrderItems = async (req, res) => {
    const { orderId } = req.params;
    const orderItems = await orderRepository.getOrderItems(orderId);
    res.status(HttpStatus.OK).json(orderItems);
};

const addOrder = async (req, res) => {
    const { orderData, orderItemsData } = req.body;
    if (!orderData || !orderItemsData) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid request body" });
    }
    const result = await orderRepository.addOrder(orderData, orderItemsData);
    if (result.success) {
        res.status(HttpStatus.CREATED).json({ message: "Order added successfully", orderId: result.orderId });
    } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: result.message });
    }
};

export default { getOrders, getOrderItems, addOrder };