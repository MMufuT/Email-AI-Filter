import axios from 'axios'
const oAuthLoginUrl = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
const serverUrl = process.env.REACT_APP_SERVER_URL

/*
GET /login-status and GET /onboarding-status API calls.
Used to check if user is logged in and onboarded
*/
const checkLoginStatus = (async (navigate) => {
  await axios.get(`${serverUrl}/auth/login-status`, { withCredentials: true })
    .then((response) => {
      // If user is authorized (logged in), no action needed
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        // If user is unauthorized (not logged in), redirect to Google OAuth login
        window.location.href = oAuthLoginUrl
      }
    })

  await axios.get(`${serverUrl}/onboarding/onboarded-status`, { withCredentials: true })
    .then((response) => {
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data.mssg

        if (errorMessage === "User is not onboarded") {
          // If user is not onboarded, navigate to the onboarding form
          navigate('/onboarding/form')

        }
      }
    })
})

export default checkLoginStatus