require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
} = process.env;

const cloudName = CLOUDINARY_CLOUD_NAME || CLOUD_NAME;
const apiKey = CLOUDINARY_API_KEY || CLOUD_KEY;
const apiSecret = CLOUDINARY_API_SECRET || CLOUD_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Cloudinary environment variables are missing.");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "decorations",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mov", "webm"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
