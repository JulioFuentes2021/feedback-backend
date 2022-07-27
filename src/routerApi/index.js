const express = require("express");
const feedback = require("./feedback");
const authRoute = require("./auth");
const signIn = require("./signIn");
const refresh = require('./refreshToken');

const routerApi = app => {
	app.use("/api/v1/feedback", feedback);
	app.use("/api/v1/auth", authRoute);
	app.use("/api/v1/sign-in", signIn);
	app.use("/api/v1/refresh", refresh);
};

module.exports = routerApi;
