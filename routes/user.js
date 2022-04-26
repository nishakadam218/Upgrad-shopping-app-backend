const router = require("express").Router();
const User = require("../models/User");
const {
    verifyToken,
} = require("./verifyToken");
//UPDATE
router.put("/:id", verifyToken, async(req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
                $set: req.body,
            }, { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;