const auth_router = require('express').Router();
const passport = require('passport');


//auth login
auth_router.get('/login', (req, res) => {
    res.render('login');
});

//auth logout
auth_router.get('/logout', (req, res) => {
    //handle with passport
    res.send('logging out');
});

//auth with google
auth_router.get('/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}))

//callback route for google to redirect to
auth_router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // Authentication finished, user data is in request
    //res.send(req.user);
    res.redirect('/search/')
})

module.exports = auth_router;