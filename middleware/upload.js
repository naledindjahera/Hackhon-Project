const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Check extension
    const allowedExtensions = /jpeg|jpg|png|gif|webp/;
    const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    // Check MIME type (allow standard image MIMEs or generic octet-stream if extension matches)
    const isMimeValid = file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream';

    if (isExtensionValid && isMimeValid) {
        cb(null, true);
    } else {
        const error = new Error('Only image files (.png, .jpg, .jpeg, .webp) are allowed!');
        error.status = 400;
        cb(error, false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;