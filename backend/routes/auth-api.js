require('dotenv').config()
const auth_router = require('express').Router()
const passport = require('passport')
const scopes = require('../auth/scopes')
const authCheck = require('../auth/auth-check')


//auth login
auth_router.get('/login', (req, res) => {
    res.render('login')
})

//auth logout
auth_router.get('/logout', (req, res) => {
    try {
        req.logout()
        res.status(200).send('Logout was successful')
    } catch(e) {
        console.error('[GET /auth/logout] Seomthing went wrong with the logout')
        res.status(500).send('Something went wrong with the logout')
    }
})

auth_router.get('/login-status', authCheck, (req, res) => {
    res.status(200).send(`User ${req.emailAddress} is authorized and onboarded`)
})

//auth with google
auth_router.get('/google', passport.authenticate('google', {
    scope: scopes,
    accessType: 'offline'
}))

//callback route for google to redirect to
auth_router.get('/google/redirect', passport.authenticate('google'),  (req, res) => {
    try{
        const { isOnboarded } = req.user
        if (!isOnboarded) {
            // console.log('started onboarding:\n\n') (Development only)
            res.redirect(`${process.env.FRONTEND_URL}/onboarding/form`) // Replace with your frontend URL
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/search`)
        }
    } catch (e) {
        console.error('[GET /auth/google/redirect] Someting went wrong with the google oauth -> web app redirect:', e)
        res.status(500).send('User could not be redirected from google oauth login')
    }
})

module.exports = auth_router