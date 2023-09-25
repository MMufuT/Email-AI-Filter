const express = require('express')
const historyRouter = express.Router()
const History = require('../models/historySchema')
const authCheck = require('../auth/auth-check')
const onboardingCheck = require('../auth/onboarding-check')

historyRouter.use(authCheck)
historyRouter.use(onboardingCheck)

// GET user's search history
historyRouter.get('/', (req, res) => {
    History.find({ userId: req.user.id })
    .sort({ updatedAt: -1 })
    .then((history) => {
        res.status(200).json({ searchHistory: history })
    })
    .catch((e) => {
        console.error('[GET /history/] Error occurred while getting all of user history:', e)
        res.status(500).send('Something went wrong with history retrieval')
    })
})

historyRouter.get('/:id', async (req, res) => {
    // this screen will display the search results from this history object 

    History.findOne({ _id: req.historyId, userId: req.user.id})
    .then((history) => {
        res.status(200).json({ searchHistory: history })
    })
    .catch((e) => {
        console.error('[GET /history/:id] Error occurred while getting a history object:', e)
        res.status(500).send('Something went wrong with the history retrieval')
    })


    // res.redirect('/search?query=${selectedSearchId}')

})

historyRouter.delete('/', (req, res) => {
    History.deleteMany({ userId: req.user.id })
    .then((deleteResult) => {
        res.status(200).json({ mssg: `Number of history objects deleted: ${deleteResult.deletedCount}` })
    })
    .catch((e) => {
        console.error('[DELETE /history/] Error occurred while deleting all of user search history:', e)
        res.status(500).send('Something went wrong while trying to delete history')
    })
})

historyRouter.delete('/:id', (req, res) => {
    History.findOneAndDelete({ _id: req.params.id, userId: req.user.id})
    .then(() => {
        res.status(200).json({ mssg: `History ${req.params} has been deleted` })
    })
    .catch((e) => {
        console.error('[DELETE /history/:id] Error occurred while deleting a history object:', e)
        res.status(500).send('Something went wrong while trying to delete history')
    })
})




module.exports = historyRouter