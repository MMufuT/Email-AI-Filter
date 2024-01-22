import axios from 'axios'
const oAuthLoginUrl = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
const serverUrl = process.env.REACT_APP_SERVER_URL

/*
GET /history API call. Used to get user's search history
*/
const getHistory = (async (navigate, setHistory) => {
    await axios.get(`${serverUrl}/history`, { withCredentials: true })
        .then((response) => {
            setHistory(response.data.searchHistory)
        })
        .catch((error) => {
            const errorMessage = error.response.data.mssg

            if (error.response && error.response.status === 409) {
                const errorMessage = error.response.data.mssg

                if (errorMessage === "User is not onboarded") {
                    navigate('/onboarding/form')
                }
            }
            else if (error.response && error.response.status === 401) {
                window.location.href = oAuthLoginUrl
            }
        })
})

export default getHistory