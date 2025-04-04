import Stripe from "stripe";
import HttpStatus from "../enums/httpsStatus.js";
import cartRepository from "../repositories/cartRepository.js";
import orderRepository from "../repositories/orderRepository.js";
import paymentRepository from "../repositories/paymentRepository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    try {
        const orderData = req.body.orderData;        
        const products = await cartRepository.getCartItems(orderData.userId);
        const result = await orderRepository.addOrder(orderData, products);
        if (!result.success) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error adding order",
            })
        }
        const orderid = result.orderId;
        const paymentData = {
            orderId: orderid,
            paymentMethod: orderData.paymentMethod,
            amount: orderData.totalAmount,
            status: "PENDING",
        }
        const paymentResult = await paymentRepository.addPayment(paymentData);
        if (!paymentResult.success) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error processing payment",
            });
        }

        const paymentId = paymentResult.paymentId;

        if(orderData.paymentMethod === "cod") {
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Order placed successfully",
                orderId: orderid,
                paymentMethod: orderData.paymentMethod,
                paymentId: paymentId,
            });
        }
        // Setting Stripe session
        const line_items = products.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `http://localhost:5174/payment-success?success=true&orderId=${orderid}`,
            cancel_url: "http://localhost:5174/cart?cancel=true",
        });

        return res.status(HttpStatus.OK).json({
            success: true,
            sessionUrl: session.url,
            orderId: orderid,
            paymentMethod: orderData.paymentMethod,
            paymentId: paymentId,
        });


    } catch (error) {
        console.log("Error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error adding order",
        });
        
    }
};

const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await orderRepository.getOrdersByUserId(userId);
        if (!orders) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "No orders found for this user",
            });
        }
        return res.status(HttpStatus.OK).json({
            success: true,
            orders: orders,
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving orders",
        });
    }
};

export default { getOrders, getOrderItems, addOrder, getOrdersByUserId };