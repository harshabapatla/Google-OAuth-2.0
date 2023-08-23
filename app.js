require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose= require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
// const bcrypt  = require("bcrypt");
// const saltRounds = 10;
const app =express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser :true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId :String,
    secret :String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields:['password'] });

const User = new mongoose.model("User",userSchema);
//mongoose.set("useCreateIndex",true);
passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
        });
    });
});
 
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

 
// passport.serializeUser(function(user, done) {
//       done(null,user.id);
//     });
  
//     passport.deserializeUser((id,cb) =>{
//         User.findById(id)
//         .then(()=>{
//             return cb(null,id);});
//         });

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET ,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



app.get("/",function(req,res){
    res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] 
}));

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect('/secrets');
  });

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/secrets",async function(req,res){
    try{
       const foundSecret = await User.find({"secret":{$ne:null}});
       if(foundSecret){
        res.render("secrets",{userWithSecrets:foundSecret});
       }
       else{
        console.log("no secret found");
       }
    }
    catch(err){
        console.log("Error in secret fetching",err);

    }});
        
//below is the old implemntation
// app.get("/secrets",function(req,res){
//     if(req.isAuthenticated()){
//         res.render("secrets");
//     }else{
//         res.redirect("/login");
//     }
// });

app.get("/submit",function(req,res){
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login");
    }
});

app.post("/submit", async function (req, res) {
    try {
      const submittedSecret = req.body.secret;
      const foundUser = await User.findById(req.user.id);
  
      if (foundUser) {
        foundUser.secret = submittedSecret;
        await foundUser.save();
        res.redirect("/secrets");
      } else {
        console.log("User not found");
        // Respond with an appropriate error or redirect to another page
        res.status(404).send("User not found");
      }
    } catch (err) {
      console.log(err);
      // Handle errors and send an appropriate response
      res.status(500).send("Internal Server Error");
    }
  });
  


app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");

});
app.post("/register",function(req,res){

    User.register(
        {username :req.body.username},req.body.password,function(err,user){
            if(err){
                console.log(err);
                res.redirect("/register");
            }
            else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/secrets");
                })
            }
        });
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     // Store hash in your password DB.
    //     const newUser = new User({
    //         email : req.body.username,
    //         //password:  md5(req.body.password)
    //         password:hash
    //      });
    //      newUser.save()
    //      .then(()=>{
    //         res.render("secrets");
    //      })
    //      .catch((err)=>{
    //         console.log(err);
    //      })
    //     });

    });
     

app.post("/login",async function(req,res){
    const user = new User({
        username: req.body.username,
        password:req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    })
    // const username = req.body.username;
    // const password = req.body.password;
    // //const password = md5(req.body.password);
    // const foundAccount = await User.findOne({email:username}).exec();
    // try {
    //     if(!foundAccount){
    //         console.log("account not found");
    //       }
    //     else{
    //         if(foundAccount){
    //             bcrypt.compare(password, foundAccount.password, function(err, result) {
    //                 // result == true
    //                 if(result===true){
    //                     res.render("secrets");
    //                 }
    //                 else{
    //                     console.log("Error loggin in",err);
    //                 }

    //             });
    //             //if(foundAccount.password===password){
    //                 //console.log("Logged you in");
                    
    //             }
    //      } }
         
    // catch (error) {
    //     console.log("err");
    // }
});
app.listen(3000,function(){
    console.log("Server started on 3000");
});  