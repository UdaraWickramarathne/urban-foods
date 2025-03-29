import multer from "multer";
import fs from "fs";
import path from "path";

const productStorage = multer.diskStorage({
    destination: "./uploads/products",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
});

const supplierStorage = multer.diskStorage({
    destination: "./uploads/suppliers",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
});

const customerStorage = multer.diskStorage({
    destination: "./uploads/customers",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
});

// Memory storage for temporary file handling
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });

// Function to manually save image after validation
const saveCustomerImage = (buffer, originalName) => {
    const fileName = `${Date.now()}${originalName}`;
    const filePath = path.join(process.cwd(), "uploads", "customers", fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, buffer);
    return fileName;
};

const saveSupplierImage = (buffer, originalName) => {
    const fileName = `${Date.now()}${originalName}`;
    const filePath = path.join(process.cwd(), "uploads", "suppliers", fileName);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, buffer);
    return fileName;
}

const saveProductImage = (buffer, originalName) => {
    const fileName = `${Date.now()}${originalName}`;
    const filePath = path.join(process.cwd(), "uploads", "products", fileName);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, buffer);
    return fileName;
}

const productUpload = multer({storage: productStorage});
const supplierUpload = multer({storage: supplierStorage});
const customerUpload = multer({storage: customerStorage});

export default {
    productUpload,
    supplierUpload,
    customerUpload,
    memoryUpload,
    saveCustomerImage,
    saveSupplierImage,
    saveProductImage
};