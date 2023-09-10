const express = require('express')
const accountRouter = express.Router()
const authCheck = require('../auth/auth-check')
const User = require('../models/userSchema')

accountRouter.use(authCheck)

accountRouter.get('/', (req, res) => {
    try{
        const { picture, emailAddress, gmailLinkId, inboxFilter } = req.user
        const accountInfo = { picture, emailAddress, gmailLinkId, inboxFilter }
        res.status(200).json({ accountInfo: accountInfo })
    } catch (e) {
        console.error('[GET /account/] An error occurred while getting account info:', e)
        res.status(500).send('Something went wrong while retreiving account info')
    }
})

accountRouter.put('/update', async (req, res) => {
    try {
        const gmailLinkId = req.body
        const userId = req.user.id
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { gmailLinkId },
            { new: true }
        )
        
        if(!updatedUser){
            return res.status(404).send('User not found')
        }

        res.status(200).send('Account information updated successfully')

    } catch (e) {
        console.error('[PUT /account/update] Error occurred while updating account information:', e)
        res.status(500).send('Something went wrong while updating account information')
    }
})

module.exports = accountRouter
