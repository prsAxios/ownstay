const express = require ('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveUrl } = require('../middleware.js');
const userController = require('../controller/user.js');


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.SignUpPost));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveUrl,passport.authenticate("local",{failureRedirect:'/login',
  failureFlash:true})
    ,userController.LoginPost);


router.route("/logout").get(userController.Logout);

    


module.exports = router ;