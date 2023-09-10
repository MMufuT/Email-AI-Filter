import axios from 'axios'

const getHistory = (async (navigate, setHistory) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/history`, { withCredentials: true })
        .then((response) => {
            setHistory(response.data.searchHistory) // Assuming 'searchHistory' is the key in your response JSON
        })
        .catch((error) => {
            const errorMessage = error.response.data.mssg

            if (errorMessage === "User is not onboarded") {
                // If user is not onboarded, navigate to the onboarding form
                navigate('/onboarding/form')
            } else {
                // If user is unauthorized (not logged in), redirect to Google OAuth login
                window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
            }
        })
})

export default getHistory