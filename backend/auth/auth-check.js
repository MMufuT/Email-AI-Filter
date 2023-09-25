const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        return res.status(401).send('User is not logged in')
    }
    else {
        // if user is logged in
        next()
    }
}




module.exports = authCheck