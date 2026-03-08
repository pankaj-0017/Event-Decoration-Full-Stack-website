const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Decoration = require("./models/decoration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

/* MongoDB connection */

mongoose.connect("mongodb://127.0.0.1:27017/decorations")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

/* Home Route */

app.get("/", (req, res) => {
    res.redirect("/decorations");
});

/* About & Contact */

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

/* Test Route */

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

/* Show All Decorations */

app.get("/decorations", async (req, res) => {

    let decorations = await Decoration.find({});
    res.render("decorations/index", { decorations });

});

/* New Decoration Form */

app.get("/decorations/new", (req, res) => {
    res.render("decorations/new");
});

/* Create Decoration */

app.post("/decorations", async (req, res) => {

    let newDecoration = new Decoration(req.body);
    await newDecoration.save();

    res.redirect("/decorations");

});

/* Edit Decoration */

app.get("/decorations/:id/edit", async (req, res) => {

    let { id } = req.params;
    let decoration = await Decoration.findById(id);

    res.render("decorations/edit", { decoration });

});

/* Update Decoration */

app.put("/decorations/:id", async (req, res) => {

    let { id } = req.params;

    await Decoration.findByIdAndUpdate(id, req.body);

    res.redirect(`/decorations/${id}`);

});

/* Delete Decoration */

app.delete("/decorations/:id", async (req, res) => {

    let { id } = req.params;

    await Decoration.findByIdAndDelete(id);

    res.redirect("/decorations");

});

/* Show Decoration Details (Dynamic Route LAST) */

app.get("/decorations/:id", async (req, res) => {

    let { id } = req.params;

    let decoration = await Decoration.findById(id);

    res.render("decorations/show", { decoration });

});

/* Server */

app.listen(3000, () => {
    console.log("Server started on port 3000");
});