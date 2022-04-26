const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const User = require('../models/userSchema');

const router = express.Router();

//registration api
router.post('/register', async(req, res) => {
    //get data
    const { firstName, lastName, password, cPassword, emailAddress, contactNumber } = req.body;
    //check user validation
    if (!firstName || !lastName || !password || !cPassword || !emailAddress || !contactNumber) {
        return res.status(422).json({ error: "please fill form properlly" });
    }
    try {
        // res.json({ message: req.body });
        //check user register or not
        const userExist = await User.findOne({ emailAddress: emailAddress })

        if (userExist) {
            return res.status(422).json({ error: "Try any other email, this email is already registered!" });
        } else if (password != cPassword) {
            return res.status(422).json({ error: "password are not matching!" });
        } else {
            const user = new User({ firstName, lastName, password, cPassword, emailAddress, contactNumber });

            const userRegister = await user.save();
            if (userRegister) {
                return res.status(201).json({ message: "user registerd successfully" });
            } else {
                res.status(500).json({ message: "faild to regisered!" });
            }
        }
    } catch (err) {
        console.log(err);
    }
});
//login api

router.post('/login', async(req, res) => {
    // console.log(req.body)
    // res.json({ message: req.body });
    try {
        const { emailAddress, password } = req.body;
        if (!emailAddress || !password) {
            return req.status(400).json({ error: "Please enter the email & password" });
        }
        const userLogin = await User.findOne({ emailAddress: emailAddress }).select("+password");
        //console.log(userLogin);
        if (userLogin) {
            //check password
            // const isMatch = await bcrypt.compare(password, userLogin.password);
            const isPasswordMatched = await userLogin.comparePassword(password);
            const token = await userLogin.generateAuthToken();
            console.log(token)
            res.cookie("jstoken", token, {
                //token valid for 30 days
                expires: new Date(Date.now() + 2589000000),
                httpOnly: true
            })

            if (!isPasswordMatched) {
                res.status(400).json({ error: "User is not find with this email & password" });
            } else {
                res.json({ message: "User login sucessfully" });
            }
        } else {
            res.status(400).json({ error: "Invalid Credentials!" });
        }

    } catch (err) {
        console.log(err);
    }
})
module.exports = router;