const User = require("../model/user");

const findUsername = async (user, cb) => {
    return await User.findOne({ username: user })
}

const findUserById = async (id) => {
    return await User.findById(id).exec()
}

module.exports = { findUsername, findUserById }

