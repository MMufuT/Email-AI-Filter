const onboardingCheck = (req, res, next) => {
    if (!req.user.isOnboarded) {
        return res.status(409).json({ mssg: 'User is not onboarded' })
    }
    else {
        // user is onboarded
        next()
    }
}

module.exports = onboardingCheck