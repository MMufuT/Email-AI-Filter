const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        res.status(401).send('User is not logged in')
    }
    else if (!req.user.isOnboarded) {
        res.status(401).json({ mssg: 'User is not onboarded'})
    } else {
        // if user is logged in
        next();
    }
};

module.exports = authCheck;