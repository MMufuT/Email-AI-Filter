require('dotenv').config();

const axios = require('axios');
const express = require('express');
const cors = require('cors')
const passport = require('passport');
const passportSetup = require('./auth/passport-setup');
const cookieSession = require('cookie-session');
const authCheck = require('./auth/auth-check');
const { onboardingQueue } = require('./utils/queue')

//express app
const app = express();
const mongoose = require('mongoose');

// setting up cross-origin resource sharing
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Set this to true to allow credentials (cookies) to be sent in the request
}));

app.use(express.json());

// setting up cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE_KEY]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// pass variables on all requests
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.session = req.session;
    next();
});


//middleware logger
app.use((req, res, next) => {
    console.log(req.originalUrl, req.method);
    next();
});

//root route
app.get('/', (req, res) => {
    onboardingQueue.removeAllListeners('onboarding')
    onboardingQueue.removeAllListeners('completed')
    onboardingQueue.removeAllListeners('failed')
    onboardingQueue.empty()
    console.log('listeners removed, queue cleaned')
    res.status(200).send('Home Page');
});



//setting up routes
const historyRoutes = require('./routes/history-api');
const searchRoutes = require('./routes/search-api');
const authRoutes = require('./routes/auth-api');
const loadingMailRoutes = require('./routes/loading-mail')
const onboardingRoutes = require('./routes/onboarding-api')
app.use('/history', historyRoutes);
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);
app.use('/loading-mail', loadingMailRoutes)
app.use('/onboarding', onboardingRoutes)

//conntect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to MongoDB and listening on port', process.env.PORT, 'yuhhh');
        });

    })
    .catch((error) => {
        console.log(error);
    });

