import axios from 'axios'

/*
DELETE /history/:id API call. Used to delete a single history item
*/
export const deleteOneHistory = ((historyId, setHistory) => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/history/${historyId}`, { withCredentials: true })
    .then((response) => {
        setHistory((prevHistory) => prevHistory.filter((item) => item._id !== historyId))
    })
    .catch((error) => {
        console.log(error)
    })
})

/*
DELETE /history/ API call. Used to delete entire search history
*/
export const deleteAllHistory = ((setHistory) => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/history/`, { withCredentials: true })
    .then((response) => {
        setHistory([])
        console.log(`History was successfully cleared:`)
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })
})