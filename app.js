
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const ListingRoute = require('./routes/listing.js');
const reviewRoute = require('./routes/review.js');
const userRoute = require('./routes/user.js');
const express_session = require('express-session');
const MongoStore= require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const path = require('path');


// MongoDB setup


// const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';
const db_url = process.env.ATLASDB_URL;
const SECRET = process.env.SECRET;
async function main() {
    await mongoose.connect(db_url);
    console.log("MongoDb connection successful...");
}
main().catch(err => console.log(err));

// Session and Flash setup


const store = new MongoStore({
    mongoUrl: db_url,
    crypto:{
        secret:SECRET,
        
    },
    touchAfter:24 * 3600
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err)
})

const sessionOptions = {
    store:store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(express_session(sessionOptions));
app.use(flash());


// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req, res, next) => {
    res.locals.SuccessMsg = req.flash("success");
    res.locals.ErrorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Middleware and static files
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);

// Routes
app.use("/listings", ListingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/",userRoute);



// Sample routes
app.get("/", (req, res) => {
    console.log("root");
    res.send("Hi, I am root...");
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "demo@gmail.com",
        username: "demo1"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
});

// Page not found middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render('error.ejs', { err });
});

// Express server setup
const port = 8080;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});


















//MiddleWare//
// app.use((req,res,next)=>{
//     // console.log("Hi I am Middleware");
//     // let {query} = req.query;
//     // console.log(query);
//     console.log("I am 1st Middleware");
//     next();
// });

// app.use((req,res,next)=>{
//     console.log("I am 2nd Middleware");
//     next();
// });

// app.use((req,res,next)=>{
//     // req.time = new Date(Date()).toString();
//     // console.log(req.time);
//     next();
// });
//Error 404//
// app.use((req,res,next)=>{
//     res.send("Page not found");
//     next();
// });

//
// app.get("/random",(req,res)=>{
//     console.log("random");
//     // res.send("this is  a random page");
// });

// app.use("/api",(req,res,next)=>{
//     let {token} = req.query;
//     if(token === "give access"){
//         next();
//     }else{
//         res.send("Access Denied");
//     }
// })
// app.get("/api",(req,res)=>{
//     res.send("data");
// })

/* Another way of how 
middlewares can be used only on the paths we want */

// const MidWare = (req,res,next)=>{
//     let {token} = req.query;
//     if(token === "give access"){
//         next();
//     }else{
//         throw new Error("Access denied");
//     }
// };
// app.get("/api",MidWare,(req,res)=>{
//     res.send("data");
// });

// app.get("/err",(req,res)=>{
//     abcd=abcd;
// });

// app.get("/admin",(req,res)=>{
//     throw new Error(403,"Access to admin is Forbidden");
// })

// app.use((err,req,res,next)=>{
//     console.log("----------Error-----------");
//     next(err);
// })

// app.use((err,req,res,next)=>{
//     console.log("-------Error-2-------");
//     next(err);
// })

// //Error 404//
// app.use((req,res,next)=>{
//     res.send("Page not found");
//     next();
// });



