/*
This functions job is to take the unix timestamp returned from POST /search API call
and turn it into a string that will be readable for the client
*/

const formatDate = ((timestamp) => {
  const date = new Date(timestamp * 1000) // Convert Unix timestamp to milliseconds
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString(undefined, options)
})

const formatMongoDate = ((dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', options)
})

module.exports = { formatDate, formatMongoDate }