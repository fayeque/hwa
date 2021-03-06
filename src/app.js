const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const util=require('util');

const urlExists=util.promisify(require('url-exists'));
const {check,validationResult}=require('express-validator/check');
var flash=require("connect-flash");
require("./db/config");
const Register = require("./models/register");
const Projectsubmission = require("./models/submit");
const async = require("hbs/lib/async");
const { resolve } = require("path");

const port = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(require("express-session")({
    secret:"my name is khan",
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:60*60*1000}
    }));

app.use(flash());
app.use(express.static(static_path))
app.set("view engine", "hbs");

app.set("views",template_path);
hbs.registerPartials(partials_path);

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

//home page
app.get("/", (req, res) =>{
    res.render("index");
});

//register page
app.get("/register",(req, res) =>{
    res.render("register");
})

//sucessful page
app.get("/successful",(req, res) =>{
    res.render("successful");
})

//creating new user data
app.post("/register",[
    check('email',"Please include a valid email").isEmail(),
],
async(req,res) =>{
    try {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            req.flash("error","Email must be valid");
            res.redirect("/register");
        }
       const registerParticiepent = new Register({
        fullname : req.body.fullname,
        email : req.body.email,
        college : req.body.Collegename,
        phonenumber : req.body.Phonenumber,
        teamname : req.body.teamname,
        othername : req.body.Othermembername
       })

    const registered = await registerParticiepent.save();
    console.log(registered);
    res.status(201).render("successful");

    } catch (error) {
        req.flash("error","Records already registered or missing details");
        res.redirect("/register");
        // res.status(400).send(error);
    }
})



//for project submission
app.post("/submit", async (req,res) =>{
    try {
        const register=await Register.findOne({teamname:req.body.nameoftheteam});
        if(!register){
            req.flash("error","Team is not registered");
            return res.redirect("/register");
        }
        // var p=new Promise((resolve,reject) => {
        //     urlExists(req.body.projectlink,(err,exists) => {
        //         if(err){
        //             reject(err);
        //         }else{
        //             resolve(exists);
        //         }
        //     });
        // });

        // p.then((e) => {
        //     console.log(e);
        //     if(!e){
        //         req.flash("error","Project link is invalid");
        //         res.redirect("/register");
        //     }
        // }).catch((err) => {
        //     console.log(err);
        //     res.redirect("/register","Something went wrong");
        // });


        let isExists=await urlExists(req.body.projectlink);
        console.log(isExists);
        if(!isExists){
            req.flash("error","Project link is invalid");
            return res.redirect("/register");
        }
        
        const submittedproject = new Projectsubmission({
            name : req.body.nameoftheteam,
            email : req.body.email,
            link : req.body.projectlink
           })
    
        const submitted = await submittedproject.save();
        console.log(submittedproject);
        req.flash("success","Submission successful");
        res.redirect("/register");
    } catch (error) {
        console.log(error);
        req.flash("error","Something went wrong");
        res.redirect("/register");
    }
})



//port
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})