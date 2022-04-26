const jwt = require('jsonwebtoken')
const clientsecreat = "jsad853475sdfj%%%^^^sgadfhs";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
        res.json({ "err": 1, "msg": "Token not match" })
    } else {
        jwt.verify(token, clientsecreat, (err, data) => {
            if (err) {
                res.json({ "err": 1, "msg": "Token invalid" })
            } else {
                next();
            }
        })
    }
}

module.exports = { authenticateToken, clientsecreat }