class Oder{
    constructor(orderId, customerId, totalAmount, orderDate, status){
        this.orderId = orderId;
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.status = status;
    }

    static fromDbRow(row, metadata){
        if (!row || !metadata || !Array.isArray(metadata)){
            return null;
        }
        let orderId = null;
        let customerId = null;
        let totalAmount = null;
        let orderDate = null;
        let status = null;

        metadata.forEach((meta, index) => {
            switch (meta.name){
                case "ORDER_ID":
                    orderId = row[index];
                    break;
                case "CUSTOMER_ID":
                    customerId = row[index];
                    break;
                case "TOTAL_AMOUNT":
                    totalAmount = row[index];
                    break;
                case "ORDER_DATE":
                    orderDate = row[index];
                    break;
                case "STATUS":
                    status = row[index];
                    break;
            }
        });

        return new Oder(orderId, customerId, totalAmount, orderDate, status);
    }
}