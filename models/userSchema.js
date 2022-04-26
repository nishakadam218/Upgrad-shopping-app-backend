const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

var validateEmail = function(emailAddress) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(emailAddress)
};
var validateContact = function(contactNumber) {
    var re = /^\d{10}$/;
    return re.test(contactNumber)
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please your Name"],
        minlength: [3, "Please enter a name atleast 3 characters"],
        maxlength: [15, "Name can not big than 15 characters"]
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
            // required: [true, "Please enter your password!"],
            // minlength: [8, "Password should be greater than 8 characters"],
            // select: false,
    },
    cPassword: {
        type: String,
        required: true
            // required: [true, "Please enter your confirm password!"],

    },
    emailAddress: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address ex:abc@gmail.com']
    },
    role: {
        type: String,
        default: "user",
    },
    contactNumber: {
        type: Number,
        required: [true, 'Contact number is required'],
        validate: [validateContact, 'Please fill a valid contact number'],
        match: [/^\d{10}$/, 'contact number should be 10 digit number']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


//we are hassing the opassword using bcryptjs

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    this.cPassword = await bcrypt.hash(this.cPassword, 10);
});
// compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }
    //we are generating jwt token
userSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({ _id: this.id }, process.env.SECRET_KEY);
        //console.log('i am from token')
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err)
    }
};



const User = mongoose.model("USER", userSchema)
module.exports = User;