const methodOverride = require("method-override");
const Decoration = require("./models/decoration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* MongoDB connection */

mongoose.connect("mongodb://127.0.0.1:27017/Decoration")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

/* Test Route */

app.get("/", (req, res) => {
    res.send("Decoration Website Backend Running");
});

app.get("/testDecoration", async (req, res) => {

    let sampleDecoration = new Decoration({
        title: "Wedding Stage Decoration",
        price: 26000,
        image: "https://example.com/wedding.jpg",
        description: "Beautiful wedding stage decoration with flowers"
    });

    await sampleDecoration.save();

    res.send("Decoration saved to database");
});

app.get("/decorations", async (req, res) => {

    let decorations = await Decoration.find({});

    res.render("decorations/index", { decorations });

});

app.get("/decorations/new", (req, res) => {
    res.render("decorations/new");
});

app.post("/decorations", async (req, res) => {

    let newDecoration = new Decoration(req.body);

    await newDecoration.save();

    res.redirect("/decorations");

});

app.get("/decorations/:id", async (req, res) => {

    let { id } = req.params;

    let decoration = await Decoration.findById(id);

    res.render("decorations/show", { decoration });

});

app.get("/decorations/:id/edit", async (req, res) => {

    let { id } = req.params;

    let decoration = await Decoration.findById(id);

    res.render("decorations/edit", { decoration });

});

app.put("/decorations/:id", async (req, res) => {

    let { id } = req.params;

    await Decoration.findByIdAndUpdate(id, req.body);

    res.redirect(`/decorations/${id}`);

});

app.delete("/decorations/:id", async (req, res) => {

    let { id } = req.params;

    await Decoration.findByIdAndDelete(id);

    res.redirect("/decorations");

});
/* Server */

app.listen(3000, () => {
    console.log("Server started on port 3000");
});