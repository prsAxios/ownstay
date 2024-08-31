const express = require('express');
const User = require('../models/user.js');

// Signup Get Request
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Signup Post Request
module.exports.SignUpPost = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email: email,
            username: username,
        });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Handle error
            }
            req.flash("success", "Welcome to Airbnb");
            return res.redirect("/listings"); // Ensure response is sent once
        });
    } catch (error) {
        req.flash("error", error.message);
        return res.redirect('/signup'); // Ensure response is sent once
    }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Login Post Request
module.exports.LoginPost = async (req, res) => {
    req.flash("success", "Welcome to AirBnB");
    let redirectUrl = res.locals.saveUrl || '/listings';
    return res.redirect(redirectUrl); // Ensure response is sent once
};

// Logout Request
module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle error
        }
        req.flash("success", "You are logged out");
        return res.redirect('/listings'); // Ensure response is sent once
    });
};
