const mongoose = require("mongoose");

const decorationSchema = new mongoose.Schema({

title: String,

price: Number,

description: String,

images: [String],   // multiple images

video: String       // one video

});

module.exports = mongoose.model("Decoration", decorationSchema);

const Decoration = mongoose.model("Decoration", decorationSchema);

module.exports = Decoration;