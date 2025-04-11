import HttpStatus from "../enums/httpsStatus.js";
import deliveryRepository from "../repositories/deliveryRepository.js";

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryRepository.getAllDeliveries();
    if (deliveries) {
      res.status(HttpStatus.OK).json(
        { success: true, deliveries: deliveries, message: "Deliveries retrieved successfully" }
      );
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "No deliveries found",
      });
    }
  } catch (error) {
    
  }
};

const getDeliveryAgents = async (req, res) => {
  try {
    const agents = await deliveryRepository.getDeliveryAgents();
    if (agents) {
      res.status(HttpStatus.OK).json(
        { success: true, agents: agents, message: "Delivery agents retrieved successfully" }
      );
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "No delivery agents found",
      });
    }
  } catch (error) {
    
  }
}

const updateDeliveryStatus = async (req, res) => {
  const { deliveryId, status } = req.body;
  try {
    const result = await deliveryRepository.updateDeliveryStatus(deliveryId, status);
    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Delivery status updated successfully",
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

const assignDeliveryAgent = async (req, res) => {
  const { deliveryId, agentId } = req.body;
  try {
    const result = await deliveryRepository.assignDeliveryAgent(deliveryId, agentId);
    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Delivery agent assigned successfully",
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

const getDeliveryByAgentId = async (req, res) => {
  const { agentId } = req.params;
  try {
    const deliveries = await deliveryRepository.getDeliveryByAgentId(agentId);
    if (deliveries) {
      res.status(HttpStatus.OK).json(
        { success: true, deliveries: deliveries, message: "Deliveries retrieved successfully" }
      );
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "No deliveries found for this agent",
      });
    }
  } catch (error) {
    
  }
}

export default {
  getAllDeliveries,
  getDeliveryAgents,
  updateDeliveryStatus,
  assignDeliveryAgent,
  getDeliveryByAgentId
};