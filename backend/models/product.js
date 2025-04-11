class Product {
  constructor(
    productId,
    supplierId,
    categoryId,
    name,
    price,
    stock,
    imageUrl,
    categoryName
  ) {
    this.productId = productId;
    this.supplierId = supplierId;
    this.categoryId = categoryId;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.imageUrl = imageUrl;
    this.categoryName = categoryName;
  }

  static fromDbRow(row, metadata) {
    if (!row || !metadata || !Array.isArray(metadata)) {
      return null;
    }
    let productId = null;
    let supplierId = null;
    let categoryId = null;
    let name = null;
    let price = null;
    let stock = null;
    let imageUrl = null;
    let categoryName = null;

    metadata.forEach((meta, index) => {
      switch (meta.name) {
        case "PRODUCT_ID":
          productId = row[index];
          break;
        case "SUPPLIER_ID":
          supplierId = row[index];
          break;
        case "CATEGORY_ID":
          categoryId = row[index];
          break;
        case "NAME":
          name = row[index];
          break;
        case "PRICE":
          price = row[index];
          break;
        case "STOCK":
          stock = row[index];
          break;
        case "IMAGE_URL":
          imageUrl = row[index];
          break;
        case "CATEGORY_NAME":
          categoryName = row[index];
          break;
      }
    });

    return new Product(
      productId,
      supplierId,
      categoryId,
      name,
      price,
      stock,
      imageUrl,
      categoryName
    );
  }
}

export default Product;
