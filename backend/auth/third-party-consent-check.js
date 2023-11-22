const thirdPartyConsentCheck = (req, res, next) => {
    if (!req.user.thirdPartyConsent) {
        return res.status(403).json({ mssg: 'You must consent to third-party API usage to access this feature.' })
    }
    else {
        // user has already consented to third-party API usage
        next()
    }
}

module.exports = thirdPartyConsentCheck