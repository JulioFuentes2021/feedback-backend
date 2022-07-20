const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const expiresIn = 1000 * 60 * 15;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn })
    return { token, expiresIn }
};

const generateRefreshToken = (id, res) => {
    const expiresIn = 1000 * 60 * 60 * 24 * 30;
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH, { expiresIn })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + expiresIn)
    })
};

module.exports = { generateToken, generateRefreshToken }