import React, { createContext, useState, useEffect } from 'react';
import storeContext from './storeContext';
import { useNotification } from './notificationContext';

export const CartContext = createContext();

// Each cart item has this structure:
// {
//   productId: 83,
//   quantity: 1,
//   name: "Milk",
//   imageUrl: "1743782636227pngwing.com (4).png",
//   price: 250
// }
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const {showNotification} = useNotification();

  const { getCartItems, handleAddToCart, updateCartItem, handleRemoveFromCart, userId  } = storeContext();

  const fetchCartItems = async () => {
      const result = await getCartItems();
      if (result) {
        setCartItems(result);
      }
  }

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);


  // Add product to cart
  const addToCart = async (product) => {
    const result = await handleAddToCart(product.productId, 1);
    if (result.success) {
      showNotification("Item added to cart", "success");
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.productId === product.productId);
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          return updatedItems;
        }
        // Add new item with full product details
        return [...prevItems, { 
          productId: product.productId,
          quantity: 1,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price
        }];
      });
    } else {
      showNotification("Failed to add item to cart", "error");
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    const result = await handleRemoveFromCart(productId);
    if (result.success) {
      setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
      showNotification("Item removed from cart", "success");
    }else {
      showNotification("Failed to remove item from cart", "error");
    }
  };



  // Update product quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const result = await updateCartItem(productId, newQuantity);
    if (result.success) {
      showNotification("Cart updated", "success");
    } else {
      showNotification("Failed to update cart", "error");
    }
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Get quantity of a specific product
  const getQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Get total number of items in cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of items in cart
  const getCartTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getQuantity,
    getCartTotal,
    getCartTotalPrice,
    fetchCartItems,
    setCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
