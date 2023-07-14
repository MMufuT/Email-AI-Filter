require('dotenv').config();

const axios = require('axios');
const express = require('express');
const cors = require('cors')
const passport = require('passport');
const passportSetup = require('./auth/passport-setup');
const cookieSession = require('cookie-session'); 

//express app
const app = express();
const mongoose = require('mongoose');

// setting up cross-origin resource sharing
app.use(cors()); 

app.use(express.json());

// setting up cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE_KEY]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//middleware logger
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//root route
app.get('/', (req, res) => {
    res.status(200).send('Home Page');

});

//setting up routes
const historyRoutes = require('./routes/history');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth-routes');
app.use('/history', historyRoutes);
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);

//conntect to DB
mongoose.connect(process.env.MONGO_URI)
    .then( () => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to MongoDB and listening on port', process.env.PORT, 'yuhhh');
        });

    })
    .catch((error) => {
        console.log(error);
    });

