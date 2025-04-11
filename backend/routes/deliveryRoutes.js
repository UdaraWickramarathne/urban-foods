import express from "express";
import deliveryController from "../controllers/deliveryController.js";

const router = express.Router();

router.get("/", deliveryController.getAllDeliveries);
router.get("/agents", deliveryController.getDeliveryAgents);
router.post("/update-status", deliveryController.updateDeliveryStatus);
router.post("/assign-agent", deliveryController.assignDeliveryAgent);
router.get('/agent/:agentId', deliveryController.getDeliveryByAgentId);

export default router;