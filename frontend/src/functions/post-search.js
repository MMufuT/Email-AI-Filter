import axios from 'axios'
import convertStringToUnixTimestamp from './string-to-unix'

/*
POST /search API call. Used to search and return matching emails from qdrant for matching emails
and add search query to search history 
*/
const postSearch = (async (navigate, location, setResults, setSearchConfig) => {

    const searchParams = new URLSearchParams(location.search)

    const searchConfig = {
        query: searchParams.get('query'),
        senderAddress: searchParams.get('sender'),
        range: {
            before: convertStringToUnixTimestamp(searchParams.get('before')),
            after: convertStringToUnixTimestamp(searchParams.get('after'))
        }
    }

    axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, searchConfig, { withCredentials: true })
        .then((response) => {
            setResults(response.data.results)
            setSearchConfig(response.data.searchConfig)
        })
        .catch((error) => {
            if (error.response && error.response.status === 409) {
                const errorMessage = error.response.data.mssg

                if (errorMessage === "User is not onboarded") {
                    navigate('/onboarding/form')
                }
            }
            else if (error.response && error.response.status === 401) {
                window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
            }
        })
})




export default postSearch