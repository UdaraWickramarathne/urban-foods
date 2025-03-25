import multer from "multer";

const productStorage = multer.diskStorage({
    destination: "./uploads/products",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
});

const productUpload = multer({storage: productStorage});

export default productUpload;