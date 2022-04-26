const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
router.post('/login', async(req, res) => {
    // console.log(req.body)
    res.json({ message: req.body });
    try {
        const { emailAddress, password } = req.body;
        if (!emailAddress || !password) {
            return res.status(400).json({ error: "Please enter the email & password" });
        }
        const userLogin = await User.findOne({ emailAddress: emailAddress }).select("+password");
        console.log(userLogin);
        if (userLogin) {
            //check password
            const isPasswordMatched = await userLogin.comparePassword(password);
            const token = await userLogin.generateAuthToken();
            console.log(token)
                // res.cookie("jstoken", token, {
                //         //token valid for 30 days
                //         expires: new Date(Date.now() + 2589000000),
                //         httpOnly: true
                //     })
                // const token = jwt.sign({ id: emailAddress }, process.env.SECRET_KEY, { expiresIn: '1800s' });
                // console.log(token)
            if (!isPasswordMatched) {
                return res.status(400).json({ error: "User is not find with this email & password" });
            }
        }

    } catch (err) {
        console.log(err);
    }
    // res.send("login api")
    console.log(req.body)
})

module.exports = router;