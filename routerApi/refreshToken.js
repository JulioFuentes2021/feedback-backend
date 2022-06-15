const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken } = require('../middleware/jwt');

const router = Router();

router.get('/', (req, res) => {
    try {
        let refreshTokenCookie = req.cookies?.refreshToken;
        if (!refreshTokenCookie) throw new Error("RefreshToken doesn't exist.")

        const { id } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        console.log('refresh: ', id)

        const { token, expiresIn } = generateToken(id);

        return res.json({ token, expiresIn })

    } catch (error) {
        console.log(error);
        return res.status(401).json({ error })
    }
});

module.exports = router;