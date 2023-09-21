import axios from 'axios'

const deleteAccount = (async (navigate) => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/account/delete`, { withCredentials: true })
        .then((response) => {
            console.log(response)
            navigate('/')
        })
        .catch((error) => {
            const errorMessage = error.response.data.mssg

            if (errorMessage === "User is not onboarded") {
                // If user is not onboarded, navigate to the onboarding form
                navigate('/onboarding/form')
            }
            else if (errorMessage === "User is not logged in") {
                // If user is unauthorized (not logged in), redirect to Google OAuth login
                window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
            }
        })
})

export default deleteAccount