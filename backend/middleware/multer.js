import multer from "multer";

// it is used to store the file locally on the server mainly used to store the images on the server
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// now use the multer to upload
const upload = multer({ storage });

export default upload;
