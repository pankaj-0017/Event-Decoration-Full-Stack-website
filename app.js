require("dotenv").config();
const multer = require("multer");
const { storage } = require("./cloudConfig/cloudinary");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Decoration = require("./models/decoration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const upload = multer({ storage });
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

app.use(session({
    secret:"decorationsite",
    resave:false,
    saveUninitialized:true
}));
app.use(flash());

app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();

});

app.use((req, res, next) => {

    res.locals.admin = req.session.admin;

    next();

});

function isAdmin(req,res,next){

    if(req.session.admin){
        next();
    }else{
        res.redirect("/admin/login");
    }

}

function getUploadedFileUrl(file) {
    return file.path || file.secure_url || file.url;
}

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
        images: ["https://example.com/wedding.jpg"],
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

app.get("/decorations/new", isAdmin, (req, res) => {
    res.render("decorations/new");
});

/* Create Decoration */

app.post("/decorations", isAdmin, upload.fields([
{ name: "images", maxCount: 10 },
{ name: "video", maxCount: 1 }
]), async (req,res)=>{
    const imageFiles = req.files?.images || [];
    const videoFile = req.files?.video?.[0];

    let newDecoration = new Decoration({
        title: req.body.title ? req.body.title.trim() : "",
        price: Number(req.body.price),
        description: req.body.description ? req.body.description.trim() : "",
        images: imageFiles.map(getUploadedFileUrl).filter(Boolean),
        video: videoFile ? getUploadedFileUrl(videoFile) : undefined
    });

    await newDecoration.save();

    req.flash("success","Decoration added successfully");

    res.redirect("/decorations");

});

/* Edit Decoration */

app.get("/decorations/:id/edit", isAdmin, async (req, res) => {

    let { id } = req.params;
    let decoration = await Decoration.findById(id);

    res.render("decorations/edit", { decoration });

});

/* Update Decoration */

app.put("/decorations/:id", isAdmin, upload.fields([
{ name: "images", maxCount: 10 },
{ name: "video", maxCount: 1 }
]), async (req, res) => {

    let { id } = req.params;
    let decoration = await Decoration.findById(id);

    decoration.title = req.body.title;
    decoration.price = req.body.price;
    decoration.description = req.body.description;

    if(req.files && req.files.images && req.files.images.length){
        decoration.images = req.files.images.map(getUploadedFileUrl).filter(Boolean);
    }

    if(req.files && req.files.video && req.files.video.length){
        decoration.video = getUploadedFileUrl(req.files.video[0]);
    }

    await decoration.save();

    req.flash("success","Decoration updated successfully!");

    res.redirect(`/decorations/${id}`);

});

/* Delete Decoration */

app.delete("/decorations/:id", isAdmin, async (req, res) => {

    let { id } = req.params;

    await Decoration.findByIdAndDelete(id);

    req.flash("success","Decoration deleted successfully!");

    res.redirect("/decorations");

});
/* Show Decoration Details (Dynamic Route LAST) */

app.get("/decorations/:id", async (req, res) => {

    let { id } = req.params;

    let decoration = await Decoration.findById(id);

    res.render("decorations/show", { decoration });

});

app.get("/admin/login", (req,res)=>{
    res.render("admin/login");
});

app.post("/admin/login",(req,res)=>{

    const {username,password} = req.body;

    if(username==="admin" && password==="1234"){
        req.session.admin = true;

        req.flash("success","Login successful!");

        res.redirect("/decorations");

    }else{

        req.flash("error","Invalid username or password");

        res.redirect("/admin/login");

    }

});

app.get("/admin/logout", (req, res) => {

    req.session.destroy();

    res.redirect("/decorations");

});

app.use((req, res) => {
    res.status(404).render("errors/error", {
        err: { message: "Page Not Found!" }
    });
});

app.use((err, req, res, next) => {

    console.log(err);

    let { message = "Something went wrong!" } = err;

    res.status(500).render("errors/error", { err });

});
/* Server */

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
