const User = require('../../model/user');
const bcrypt = require('bcrypt');

const signIn = async (req, res, next) => {
    try {
        const { username, password, mail } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hash, mail });
        await newUser.save();
        delete password;

        console.log("Cookies desde auth/login: ", newUser.id);
        // const { token, expiresIn } = generateToken(newUser.id);
        // generateRefreshToken(newUser.id, res)

        res.json({
            message: 'User created successfully',
            user: req.body,
            // token,
        });
    } catch (error) {
        console.log(error)
        next(
            boom.badRequest(
                "You need an username and password to create an account"
            )
        );
    }
};

module.exports = { signIn }