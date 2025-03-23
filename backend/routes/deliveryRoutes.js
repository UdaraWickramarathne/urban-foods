import express from "express";
import deliveryController from "../controllers/deliveryController.js";

const router = express.Router();

router.get("/", deliveryController.getAllDeliveries);
router.get("/:deliveryId", deliveryController.getDeliveryById);
router.post("/add", deliveryController.insertDelivery);
router.delete("/:deliveryId", deliveryController.deleteDelivery);
router.put("/:deliveryId", deliveryController.updateDelivery);

export default router;