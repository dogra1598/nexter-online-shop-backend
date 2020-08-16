const { v1: uuidv1 } = require('uuid');
const multer = require("multer");

const MIME_TYPE_MAP = {
    "image/png" : "png",
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
}

const fileUplaod = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/images");
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv1() + "." + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid minme type");
        cb(error, isValid);
    }
});

module.exports = fileUplaod;