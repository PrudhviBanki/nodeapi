const multer = require("multer");
const {GridFsStorage} = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: 'mongodb+srv://bankiprudhviapp:pk143@cluster0.hv4xtww.mongodb.net/employpeeDB',
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-employee_photo-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-employee_photo-${file.originalname}`,
        };
    },
});

storage.on('connectionError', err => {
    console.error('Error connecting to MongoDB:', err);
});
module.exports = multer({ storage });