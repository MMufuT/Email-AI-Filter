require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors')

//express app
const app = express();
const mongoose = require('mongoose');

//middleware json parser
    /*every request will be checked if it has a json body. If it does, it 
    will be attached to the req handler */
app.use(cors());
app.use(express.json());

//middleware logger
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes
    /* NOTE: Routes ALWAYS need to be placed after'app.use(express.json))'.
     'app.use(express.json))' needs to be declared before any routes that 
     handle oncoming requests. If declared after, the routes won't be able 
     to use express.json */
app.get('/', (req, res) => {
    res.status(200).send('success');
    
    //Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log(token + '\n^                    ^\n^                    ^\n^FUCK YES, AUTH TOKEN^');
  
});

const historyRoutes = require('./routes/history');
const searchRoutes = require('./routes/search');
app.use('/history', historyRoutes);
app.use('/search', searchRoutes);
//test change

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

