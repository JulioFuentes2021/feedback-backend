const mongoose = require("mongoose");

const userSchema = {
	username: String,
	// password: { type: String, default:null, select:false},
	password: String,
	mail: String,
};

const User = mongoose.model("User", userSchema);
module.exports = User;
