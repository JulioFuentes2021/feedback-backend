const User = require('../../model/user');
const { generateToken, generateRefreshToken } = require('../../middleware/jwt');

const login = async (req, res, next) => {
    try {
        console.log('Se ejecuto')
        const { token, expiresIn } = generateToken(req.user.id);
        generateRefreshToken(req.user.id, res)

        res.json({
            token,
            expiresIn
        })
    } catch (error) {
        console.log(error)
        next(
            boom.badRequest(
                "You need an username and password to create an account"
            )
        );
    }
}

module.exports = { login }