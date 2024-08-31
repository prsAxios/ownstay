const express = require ('express');
const app = express();
const express_session = require('express-session');
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));
const flash = require('connect-flash');
const path = require('path');


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");




const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}

app.use(express_session(sessionOptions));

app.use(flash());

app.use((req,res,next)=>{
    res.locals.messages = req.flash('info');
    next();
});

app.get('/render',(req,res)=>{
    req.flash('info', 'flash is back');
    res.render('render.ejs');
})
app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    req.flash('info','flash is back');
    res.redirect('/hello');
});

app.get("/hello",(req,res)=>{
    res.render('page.ejs',{name:req.session.name});
});
// app.get("/req_count",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count= 1;
//     }
//     res.send(`you send a request ${req.session.count} times`);
// });


/************** Cookie Practise Below ***************/


// app.get("/getSignedCookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("Signed Cookie Sent")
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// // app.get('/getCookies',(req,res)=>{
// //     res.cookie("greet","hello");
// //     res.send("sent you some cookies..");
// // });

// app.get('/',(req,res)=>{
//     console.dir(req.cookies);
//     res.send('cookie succes');
// });


app.listen(3000,()=>{
    console.log("Succesfull listening");
});