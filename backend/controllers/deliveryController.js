import HttpStatus from "../enums/httpsStatus.js";
import deliveryRepository from "../repositories/deliveryRepository.js";

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryRepository.getAllDeliveries();
    res.status(HttpStatus.OK).json(deliveries);
  } catch (error) {
    console.error("Error in getAllDeliveries controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving deliveries",
    });
  }
};

const getDeliveryById = async (req, res) => {
  try {
    const deliveryId = req.params.deliveryId;
    const delivery = await deliveryRepository.getDeliveryById(deliveryId);
    if (delivery) {
      res.status(HttpStatus.OK).json(delivery);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Delivery not found",
      });
    }
  } catch (error) {
    console.error("Error in getDeliveryById controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving delivery",
    });
  }
};

const insertDelivery = async (req, res) => {
  console.log("insertDelivery controller");
  try {
    const deliveryData = req.body;
    const result = await deliveryRepository.insertDelivery(deliveryData);
    res.status(HttpStatus.CREATED).json({ success: true, deliveryId: result.deliveryId });
  } catch (error) {
    console.error("Error in insertDelivery controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error inserting delivery",
    });
  }
};

const deleteDelivery = async (req, res) => {
  try {
    const deliveryId = req.params.deliveryId;
    await deliveryRepository.deleteDelivery(deliveryId);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    console.error("Error in deleteDelivery controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting delivery",
    });
  }
};

const updateDelivery = async (req, res) => {
  try {
    const deliveryId = req.params.deliveryId;
    const deliveryData = req.body;
    const result = await deliveryRepository.updateDelivery(deliveryId, deliveryData);
    if (result.success) {
      res.status(HttpStatus.OK).json({ success: true, message: result.message });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Delivery not found",
      });
    }
  } catch (error) {
    console.error("Error in updateDelivery controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating delivery",
    });
  }
};

export default {
  getAllDeliveries,
  getDeliveryById,
  insertDelivery,
  deleteDelivery,
  updateDelivery,
};