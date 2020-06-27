//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const app = express();
const encrypt=require("mongoose-encryption")
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User= new mongoose.model("User",userSchema)
app.get('/', (req, res) => {
  res.render('home');
});

app.route('/login')
.get(function(req, res) {
  res.render('login');
})
.post(function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email:username},function(err,founduser){
    if(err){
      console.log("Incorrect username"+err)
    }else{
      if(founduser.password===password){
        res.render("secrets")
      }else {console.log("Incorrect password"+founduser.password+"is not same as"+password)}
    }
  });
});


app.route('/register')
.get(function(req, res){
  res.render('register');
})
.post(function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })

});



app.listen(port, () => console.log(`Server started at port: ${port}`)
);
