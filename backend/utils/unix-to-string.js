/*
This functions job is to take the unix timestamp returned from the api call and turn it into 
*/

const formatDate = ((timestamp) => {
    const date = new Date(timestamp * 1000) // Convert Unix timestamp to milliseconds
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString(undefined, options)
  })

module.exports = { formatDate }