class Category{
    constructor(id, name, description, productCount){
        this.id = id;
        this.name = name;
        this.description = description;
        this.productCount = productCount;
    }
    static fromDbRow(row, metadata){
        if(!row || !metadata || !Array.isArray(metadata)){
            return null;
        }
        let id = null;
        let name = null;
        let description = null;
        let productCount = null;

        metadata.forEach((meta, index) => {
            switch(meta.name){
                case 'CATEGORY_ID':
                    id = row[index];
                    break;
                case 'NAME':
                    name = row[index];
                    break;
                case 'DESCRIPTION':
                    description = row[index];
                    break;
                case 'PRODUCT_COUNT':
                    productCount = row[index];
                    break;
            }
        });

        return new Category(id, name, description, productCount);
    }
}

export default Category;