class Delivery {
  constructor(deliveryId, orderId, status, estimatedDate, trackingNumber) {
    this.deliveryId = deliveryId;
    this.orderId = orderId;
    this.status = status;
    this.estimatedDate = estimatedDate;
    this.trackingNumber = trackingNumber;
  }

  static fromDbRow(row, metadata) {
    if (!row || !metadata || !Array.isArray(metadata)) {
      return null;
    }

    let deliveryId = null;
    let orderId = null;
    let status = null;
    let estimatedDate = null;
    let trackingNumber = null;

    metadata.forEach((meta, index) => {
      switch(meta.name) {
        case 'DELIVERY_ID':
          deliveryId = row[index];
          break;
        case 'ORDER_ID':
          orderId = row[index];
          break;
        case 'STATUS':
          status = row[index];
          break;
        case 'ESTIMATED_DATE':
          estimatedDate = row[index];
          break;
        case 'TRACKING_NUMBER':
          trackingNumber = row[index];
          break;
      }
    });

    return new Delivery(deliveryId, orderId, status, estimatedDate, trackingNumber);
  }
}

export default Delivery;