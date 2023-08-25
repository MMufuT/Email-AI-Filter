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
    // this screen will display the search results from this history object 

    History.findOne({ _id: req.historyId, userId: req.user.emailAddress})
    .then((history) => {
        res.status(200).json({ searchHistory: history })
    })
    .catch((e) => {
        res.status(500).send('Something went wrong with the history retrieval')
    })


    // res.redirect('/search?query=${selectedSearchId}');

});

historyRouter.delete('/', (req, res) => {
    History.deleteMany({ userId: req.user.id})
    .then((deleteResult) => {
        res.json({ mssg: `Number of history objects deleted: ${deleteResult.deletedCount}` })
    })
    .catch((e) => {
        res.status(500).send('Something went wrong while trying to delete history')
    })
});

historyRouter.delete('/:id', (req, res) => {
    History.findOneAndDelete({ _id: req.historyId, userId: req.user.emailAddress})
    .then(() => {
        res.status(200).json({ mssg: `History ${req.historyId} has been deleted` })
    })
    .catch((e) => {
        res.status(500).send('Something went wrong while trying to delete history')
    })
})




module.exports = historyRouter;