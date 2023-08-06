import path from "path"; // Import the path module
import multer from "multer"; // Import multer

// Create a storage destination and file naming function for multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./books"); // Specify the folder where you want to store the uploaded files locally
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filenameWithExtension = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
        cb(null, filenameWithExtension);
    },

});

// Create an instance of the multer middleware
export const uploadFile = multer({ storage });
