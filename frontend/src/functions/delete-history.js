import axios from 'axios'

export const deleteOneHistory = ((historyId, setHistory) => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/history/${historyId}`, { withCredentials: true })
    .then((response) => {
        setHistory((prevHistory) => prevHistory.filter((item) => item._id !== historyId))
    })
    .catch((error) => {
        console.log(error)
    })
})

export const deleteAllHistory = (() => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/history/`, { withCredentials: true })
    .then((response) => {
        console.log(`History was successfully cleared: ${response}`)
    })
    .catch((error) => {
        console.log(error)
    })
})