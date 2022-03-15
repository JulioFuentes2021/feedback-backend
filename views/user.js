const User = require("../model/user");

const findUsername = async (user, cb) => {
    return await User.find({ name: user }, cb)
}

module.exports = findUsername

