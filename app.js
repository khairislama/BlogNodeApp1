const   bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        express     = require("express"),
        app         = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restfull_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})