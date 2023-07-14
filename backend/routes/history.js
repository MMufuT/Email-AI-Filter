const express = require('express');
const historyRouter = express.Router();
const History = require('../models/searchSchema');
const authCheck = require('../auth/auth-check');


// GET user's search history
historyRouter.get('/', authCheck, (req, res) => {
    res.json({mssg: 'get the users search history'})
});

historyRouter.get('/:id', (req, res) => {
    res.json({mssg: 'display the results for the selected historic search'})
    // const selectedSearchId = req.params.id



    // res.redirect('/search?query=${selectedSearchId}');

});

historyRouter.delete('/:id', (req, res) => {
    res.json({mssg: 'delete the selected historic search'})
});


module.exports = historyRouter;