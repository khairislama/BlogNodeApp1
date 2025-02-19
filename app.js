const   bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        methodOverride  = require("method-override"),
        expressSanitizer= require("express-sanitizer"),
        express         = require("express"),
        app             = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restfull_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);

//ROUTES
app.get("/", (req,res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req,res)=>{
    Blog.find({}, (err, blogs)=>{
        if (err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    })    
});

app.get("/blogs/new", (req,res)=>{
    res.render("new");
});

app.post("/blogs", (req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err){
            res.redirect("/blogs");
        }else {
            res.render("edit", {blog : foundBlog});
        }
    });
});

app.put("/blogs/:id", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

app.delete("/blogs/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if (err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})