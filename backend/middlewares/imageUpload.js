import multer from "multer";

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

const productUpload = multer({storage: productStorage});
const supplierUpload = multer({storage: supplierStorage});
const customerUpload = multer({storage: customerStorage});

export default {
    productUpload,
    supplierUpload,
    customerUpload
};