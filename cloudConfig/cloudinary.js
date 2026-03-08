const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dq4ofknsj",
  api_key: "342931193766651",
  api_secret: "28GSJpnDpfPQ_52b7bYwp1JE8SU",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "decorations",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};