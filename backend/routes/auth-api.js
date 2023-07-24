const auth_router = require('express').Router();
const passport = require('passport');
const scopes = require('../auth/scopes');


//auth login
auth_router.get('/login', (req, res) => {
    res.render('login');
});

//auth logout
auth_router.get('/logout', (req, res) => {
    //handle with passport
    //res.send('logging out');
    req.logout();
    res.redirect('/');
});

//auth with google
auth_router.get('/google', passport.authenticate('google', {
    scope: scopes,
    accessType: 'offline'
}))

//callback route for google to redirect to
auth_router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // Authentication finished, user data is in request
    //res.send(req.user);
    const { isOnboarded } = req.user
    if (!isOnboarded) {
        console.log('started onboarding:\n\n')
        res.redirect('http://localhost:3000/onboarding'); // Replace with your frontend URL
    } else {
        // If user is already onboarded, redirect to the search frontend URL
        res.redirect('http://localhost:3000/search'); // Replace with your frontend URL
    }


    
})

module.exports = auth_router;