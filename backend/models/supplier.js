class Supplier {
  constructor(supplierID, name, address, phone, email) {
    this.supplierID = supplierID;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
  }

  static fromDbRow(row, metadata) {
    if (!row || !metadata || !Array.isArray(metadata)) {
      return null;
    }
    let supplierId = null;
    let name = null;
    let address = null;
    let phone = null;
    let email = null;

    metadata.forEach((meta, index) => {
      switch (meta.name) {
        case "SUPPLIER_ID":
          supplierId = row[index];
          break;
        case "NAME":
          name = row[index];
          break;
        case "ADDRESS":
          address = row[index];
          break;
        case "PHONE":
          phone = row[index];
          break;
        case "EMAIL":
          email = row[index];
          break;
      }
    });

    return new Supplier(supplierId, name, address, phone, email);
  }
}

export default Supplier;
