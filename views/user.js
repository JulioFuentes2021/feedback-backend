const User = require("../model/user");

const findUsername = async (mail, cb) => {
    return await User.findOne({ mail: mail })
}

const findUserById = async (id) => {
    return await User.findById(id).exec()
}

const users = async () => {
    return await User.find();
}

module.exports = { findUsername, findUserById, users }

