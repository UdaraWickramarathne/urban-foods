import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", cartController.getCartItems);
router.post("/", cartController.addToCart);
router.put("/:product_id", cartController.updateCartItem);
router.delete("/:product_id", cartController.removeFromCart);
router.delete("/clear/:userId", cartController.clearCart);

export default router;