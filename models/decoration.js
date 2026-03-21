const mongoose = require("mongoose");

const decorationSchema = new mongoose.Schema({

title: String,

price: Number,

description: String,

images: {
type: [String],
default: []
},

video: String       // one video

});
const Decoration = mongoose.model("Decoration", decorationSchema);

module.exports = Decoration;
