class OrderItem {
    constructor(orderItemId, orderId, productId, quantity, unitPrice) {
        this.orderItemId = orderItemId;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    static fromDbRow(row, metadata) {
        if (!row || !metadata || !Array.isArray(metadata)) {
            return null;
        }

        let orderItemId = null;
        let orderId = null;
        let productId = null;
        let quantity = null;
        let unitPrice = null;

        metadata.forEach((meta, index) => {
            switch (meta.name) {
                case 'ORDER_ITEM_ID':
                    orderItemId = row[index];
                    break;
                case 'ORDER_ID':
                    orderId = row[index];
                    break;
                case 'PRODUCT_ID':
                    productId = row[index];
                    break;
                case 'QUANTITY':
                    quantity = row[index];
                    break;
                case 'UNIT_PRICE':
                    unitPrice = row[index];
                    break;
            }
        });

        return new OrderItem(orderItemId, orderId, productId, quantity, unitPrice);
    }
}

export default OrderItem;