import axios from 'axios'

const checkLoginStatus = (async (navigate) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/login-status`, { withCredentials: true })
        .then((response) => {
            // If user is authorized (logged in), no action needed
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                // If user is unauthorized (not logged in), redirect to Google OAuth login
                window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL;
            }
        });

    await axios.get(`${process.env.REACT_APP_SERVER_URL}/onboarding/onboarded-status`, { withCredentials: true })
        .then((response) => {
            if (!response.data.onboarded) {
                // redirects if user is already onboarded
                navigate('/onboarding/form')
            }
        })
        .catch((error) => {
            console.log(error)
        })
})

  export default checkLoginStatus