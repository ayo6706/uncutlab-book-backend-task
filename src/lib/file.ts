import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./books"); // Use an absolute path
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filenameWithExtension = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
        cb(null, filenameWithExtension);
    },

});

const uploadFile = multer({ storage });

export default uploadFile;
