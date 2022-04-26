const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const User = require("../models/UserSchema");

//register user

exports.registerUser = catchAsyncError(async(req, res, next) => {

    const { firstName, lastName, password, cPassword, emailAddress, contactNumber } = req.body;

    const user = await User.create({
        firstName,
        lastName,
        password,
        cPassword,
        emailAddress,
        contactNumber
    });
    sendToken(user, 201, res);
});
//login user
exports.loginUser = catchAsyncError(async(req, res, next) => {
    const { emailAddress, password } = req.body;

    // checking if user has given password and email both

    if (!emailAddress || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ emailAddress }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }
    sendToken(user, 200, res);
});

//logout user

exports.logout = catchAsyncError(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});