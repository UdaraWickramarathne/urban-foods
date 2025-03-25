import HttpStatus from "../enums/httpsStatus.js";
import cartRepository from "../repositories/cartRepository.js";

const getCartItems = async (req, res) => {
  try {
    const cartItems = await cartRepository.getCartItems(req.params.userId);
    res.status(HttpStatus.OK).json(cartItems);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving cart items",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const result = await cartRepository.addToCart(req.body);
    res.status(HttpStatus.CREATED).json(result);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error adding item to cart",
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const result = await cartRepository.updateCartItem(req.params.cartId, req.body.quantity);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating cart item",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const result = await cartRepository.removeFromCart(req.params.cartId);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error removing item from cart",
    });
  }
};

export default { getCartItems, addToCart, updateCartItem, removeFromCart };
