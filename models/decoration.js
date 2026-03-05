const mongoose = require("mongoose");

const decorationSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String
});

const Decoration = mongoose.model("Decoration", decorationSchema);

module.exports = Decoration;