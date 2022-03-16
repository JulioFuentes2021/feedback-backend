const User = require("../model/user");

const findUsername = async (user, cb) => {
    return await User.findOne({ username: user })
}

const findUserById = async (id) => {
    return await User.findById(id).exec()
}

const users = async () => {
    return await User.find();
}

module.exports = { findUsername, findUserById, users }

