class Supplier {
  constructor(supplierID, businessName, address, email, imageUrl) {
    this.supplierID = supplierID;
    this.businessName = businessName;
    this.address = address;
    this.email = email;
    this.imageUrl = imageUrl;
  }

  static fromDbRow(row, metadata) {
    if (!row || !metadata || !Array.isArray(metadata)) {
      return null;
    }
    let supplierId = null;
    let name = null;
    let address = null;
    let email = null;
    let imageUrl = null;

    metadata.forEach((meta, index) => {
      switch (meta.name) {
        case "SUPPLIER_ID":
          supplierId = row[index];
          break;
        case "BUSINESS_NAME":
          name = row[index];
          break;
        case "ADDRESS":
          address = row[index];
          break;
        case "EMAIL":
          email = row[index];
          break;
        case "IMAGE_URL":
          imageUrl = row[index];
          break;
      }
    });

    return new Supplier(supplierId, name, address, email, imageUrl);
  }
}

export default Supplier;
