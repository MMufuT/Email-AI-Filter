import axios from 'axios'
import convertStringToUnixTimestamp from './string-to-unix'

const postSearch = (async (navigate, location, setResults, setSearchConfig) => {

    const searchParams = new URLSearchParams(location.search)

    const searchConfig = {
        query: searchParams.get('query'),
        senderAddress: searchParams.get('sender'), // or specify an email address
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
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data.mssg
                
                if (errorMessage === "User is not onboarded") {
                    // If user is not onboarded, navigate to the onboarding form
                    navigate('/onboarding/form')
                  } else {
                    // If user is unauthorized (not logged in), redirect to Google OAuth login
                    window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
                  }
            }
        })
})




export default postSearch