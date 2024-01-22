import axios from 'axios'
const serverUrl = process.env.REACT_APP_SERVER_URL

/*
DELETE /history/:id API call. Used to delete a single history item
*/
export const deleteOneHistory = ((historyId, setHistory) => {
    axios.delete(`${serverUrl}/history/${historyId}`, { withCredentials: true })
    .then((response) => {
        setHistory((prevHistory) => prevHistory.filter((item) => item._id !== historyId))
    })
    .catch((error) => {
        console.log('Something went wrong while deleting history item')
    })
})

/*
DELETE /history/ API call. Used to delete entire search history
*/
export const deleteAllHistory = ((setHistory) => {
    axios.delete(`${serverUrl}/history/`, { withCredentials: true })
    .then((response) => {
        setHistory([])
        console.log(`History was successfully cleared:`)
        // console.log(response) (Development only)
    })
    .catch((error) => {
        console.log('Something went wrong while clearing history')
    })
})