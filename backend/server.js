require('dotenv').config();

const express = require('express');
const cors = require('cors')
const passport = require('passport');
const cookieSession = require('cookie-session');
const { onboardingQueue } = require('./utils/queue')

/*
I know it doesn't look like this is being used, but it is somehow.
Deleting it will mess up something regarding sessions and cookie serializatoin/deserializaion
*/
const passportSetup = require('./auth/passport-setup');

//express app
const app = express();
const mongoose = require('mongoose');

// setting up cross-origin resource sharing
app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
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
    onboardingQueue.empty()
    console.log('queue cleaned')
    res.status(200).send('Home Page');
});



//setting up routes
const historyRoutes = require('./routes/history-api')
const searchRoutes = require('./routes/search-api')
const authRoutes = require('./routes/auth-api')
const onboardingRoutes = require('./routes/onboarding-api')
const accountRouter = require('./routes/account-api')
app.use('/history', historyRoutes)
app.use('/search', searchRoutes)
app.use('/onboarding', onboardingRoutes)
app.use('/account', accountRouter)
app.use('/auth', authRoutes)


//connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to MongoDB and listening on port', process.env.PORT, 'yuhhh')
        })

    })
    .catch((error) => {
        console.log(error)
    })

