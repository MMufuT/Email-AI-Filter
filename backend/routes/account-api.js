const express = require('express')
const accountRouter = express.Router()
const authCheck = require('../auth/auth-check')
const User = require('../models/userSchema')
const History = require('../models/historySchema')
const { deleteQdrantCollection } = require('../utils/embedding-functions')
const { onboardingQueue } = require('../utils/queue')

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

accountRouter.patch('/update', async (req, res) => {
    try {
        const gmailLinkId = req.body.gmailLinkId
        const userId = req.user.id
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { gmailLinkId },
            { new: true }
        )
        
        if(!updatedUser){
            return res.status(404).send('User not found')
        }

        res.status(200).json({
            mssg: 'Account information updated successfully',
            newGmailLinkId: updatedUser.gmailLinkId
        })

    } catch (e) {
        console.error('[PATCH /account/update] Error occurred while updating account information:', e)
        res.status(500).send('Something went wrong while updating account information')
    }
})

accountRouter.delete('/delete', async (req, res) => {
    try {
        const userId = req.user.id
        const { emailAddress } = req.user
        await History.deleteMany({ userId: userId })
        const deletedMongoUser = await User.findByIdAndDelete(userId)
        const deletedQdrantUser = await deleteQdrantCollection(emailAddress)
        if(!deletedMongoUser || !deletedQdrantUser){
            return res.status(404).send('User not found')
        }
        res.status(200).send(`User ${emailAddress} deleted successfully`)
    } catch (e) {
            console.error('[DELETE /account/delete] Error occurred while deleting user:', e)
            res.status(500).send('Something went wrong while deleting user')
    }
})

module.exports = accountRouter
