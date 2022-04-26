const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cPassword: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, { timestamps: true });

//we are hassing the opassword using bcryptjs

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    this.cPassword = await bcrypt.hash(this.cPassword, 10);
});
// compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }
    //we are generating jwt token
UserSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, process.env.SECRET_KEY);
        console.log('i am from token')
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err)
    }
};

module.exports = mongoose.model("User", UserSchema);