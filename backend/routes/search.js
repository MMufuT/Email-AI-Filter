const express = require('express');
const searchRouter = express.Router();
const Search = require('../models/searchSchema');
const passport = require('passport');
const authCheck = require('../auth/auth-check');

// const authCheck = (req, res, next) => {
//     if(!req.user){
//         // if user is not logged in
//         res.redirect('/auth/google');
//     } else {
//         // if user is logged in
//         next();
//     }
// };

searchRouter.get('/', authCheck, (req, res) => {
    res.json({mssg: 'Search Screen.. username: '+req.user.username })
});
 
//Post a new history tab to the /history path
searchRouter.post('/', async (req, res) => {
    //const query = req.body;
    const {query, results} = req.body;

    try {

        // Create a new Search document in the history collection
        //Task: create search schema
        //Note: 'search results' will be a const
        //-----
        
        // const searchResults = await performSearch(query);
        
        // const Search = await Search.create({
        //     query: req.body,
        //     results: searchResults,
        // });
        
        // res.status(200).json(searchResults)

        const newSearchSchema = await Search.create({query, results})
        res.status(200).json(newSearchSchema);

    } catch (error) {
        res.status(400).json({error: error.message})
    }

});



module.exports = searchRouter;