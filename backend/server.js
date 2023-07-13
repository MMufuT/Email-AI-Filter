require('dotenv').config();

const jwt = require('jsonwebtoken');
const axios = require('axios');
const express = require('express');
const cors = require('cors')
const passportSetup = require('./auth/passport-setup');

//express app
const app = express();
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

//middleware logger
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//root route
app.get('/', (req, res) => {
    res.status(200).send('success');
    
    //Authorization
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader && authHeader.split(' ')[1];

    console.log(jwtToken + '^AUTH TOKEN^');
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

