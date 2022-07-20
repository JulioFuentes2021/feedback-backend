function authenticationMiddleware() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        console.log("Algo ha salido mal")
        res.send("ALgo ha salido mal")
    }
}

module.exports = authenticationMiddleware