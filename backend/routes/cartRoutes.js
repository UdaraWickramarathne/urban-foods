import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", cartController.getCartItems);
router.post("/", cartController.addToCart);
router.put("/:cartId", cartController.updateCartItem);
router.delete("/:cartId", cartController.removeFromCart);

export default router;