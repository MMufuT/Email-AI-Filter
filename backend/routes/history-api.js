const express = require('express');
const historyRouter = express.Router();
const History = require('../models/historySchema');
const authCheck = require('../auth/auth-check');

historyRouter.use(authCheck)

// GET user's search history
historyRouter.get('/', authCheck, (req, res) => {
    History.find({ userId: req.user.id})
    .then((history) => {
        res.json({ searchHistory: history })
    })
    
    //else error
});

historyRouter.get('/:id', async (req, res) => {
    History.findOne({ _id: req.historyId, userId: req.user.emailAddress})
    .then((history) => {
        res.json({ searchHistory: history })
    })
    
    //else error

    // res.redirect('/search?query=${selectedSearchId}');

});

historyRouter.delete('/', (req, res) => {
    History.deleteMany({ userId: req.user.id})
    .then((deleteResult) => {
        res.json({ mssg: `Number of history objects deleted: ${deleteResult.deletedCount}` })
    })
    
    //else error
});

historyRouter.delete('/:id', (req, res) => {
    History.findOneAndDelete({ _id: req.historyId, userId: req.user.emailAddress})
    .then(() => {
        res.json({ mssg: `History ${req.historyId} has been deleted` })
    })

    //else error
})




module.exports = historyRouter;