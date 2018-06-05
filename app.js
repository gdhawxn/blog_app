var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride=require('method-override');
app.set("view engine",'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect(process.env.DATABASEURL);

app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var blog = mongoose.model("blogs",blogSchema);

app.get("/",function(req,res){
   res.redirect("/blogs"); 
});

app.get("/blogs",function(req,res){
   blog.find({},function(err,blogs){
       if(!err){
        res.render("index",{b:blogs});   
       }
   });
});

app.get("/new",function(req,res){
   res.render("new"); 
});

app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var b=req.body.blog;
    blog.create(b,function(err,blogs){
       if(!err){
           res.redirect("/blogs");
       } 
    });
});

app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,blogs){
        if(!err){
            res.render("show",{b:blogs});
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
   blog.findById(req.params.id,function(err,blogs){
       if(!err){
           res.render("edit",{b:blogs});
       }
       else{
           res.redirect("/blogs");
       }
   });
});

app.put("/blogs/:id",function(req,res){
   var b=req.body.blog;
   blog.findByIdAndUpdate(req.params.id,b,function(err,blogs){
      if(!err){
          res.redirect("/blogs/"+req.params.id);
      }
   });
});

app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog Server : Activated");
});