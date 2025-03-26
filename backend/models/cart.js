class Cart {
    constructor(cartId, userId, productId, quantity, addedAt) {
      this.cartId = cartId;
      this.userId = userId;
      this.productId = productId;
      this.quantity = quantity;
      this.addedAt = addedAt;
    }
  
    static fromDbRow(row, metadata) {
      if (!row || !metadata || !Array.isArray(metadata)) {
        return null;
      }
      let cartId = null;
      let userId = null;
      let productId = null;
      let quantity = null;
      let addedAt = null;
  
      metadata.forEach((meta, index) => {
        switch (meta.name) {
          case "CART_ID":
            cartId = row[index];
            break;
          case "USER_ID":
            userId = row[index];
            break;
          case "PRODUCT_ID":
            productId = row[index];
            break;
          case "QUANTITY":
            quantity = row[index];
            break;
          case "ADDED_AT":
            addedAt = row[index];
            break;
        }
      });
  
      return new Cart(cartId, userId, productId, quantity, addedAt);
    }
  }
  
  export default Cart;