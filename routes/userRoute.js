const express = require("express")
const router = express.Router();
const { registerUser, loginUser, logout, getUserDetails } = require("../controller/userController");
const { isAuthenticatedUser } = require("../middleware/auth")

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

module.exports = router;