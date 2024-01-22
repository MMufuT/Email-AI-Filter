import axios from 'axios'
const oAuthLoginUrl = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
const serverUrl = process.env.REACT_APP_SERVER_URL

/*
DELETE /onboarding/no-consent-delete-account API call. Used to delete user's account in the event that they do not consent to third-party API usage
*/
export const noConsentDeleteAccount = (async (navigate) => {
    axios.delete(`${serverUrl}/onboarding/no-consent-delete-account`, { withCredentials: true })
        .then((response) => {
            console.log(`Email AI Filter requires usage of Third Party Tools to function. Since no consent was given, your account with us was deleted and your google account was logged out.`)
            // console.log(response) (Development only)
            navigate('/')
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                window.location.href = oAuthLoginUrl
            }
        })
})

/*
GET /onboarding/third-party-consent API call. Used to check if user has given consent to use third-party API tools
*/
export const getConsentStatus = (async (navigate) => {
    axios.get(`${serverUrl}/onboarding/third-party-consent`, { withCredentials: true })
        .then((response) => {
            console.log(`Consent has already been given to Email AI Filter to use Third Party Tools.`)
            // console.log(response) (Development only)
            navigate('/onboarding/form')
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                window.location.href = oAuthLoginUrl
            }
        })
})

/*
POST /onboarding/third-party-consent API call. Used to update user's consent to use third-party API tools
*/



// (temporary disabled for the sake of CASA)
export const consentGiven = (async (navigate) => {
    axios(`${serverUrl}/onboarding/third-party-consent`, {
        method: "post",
        withCredentials: true
    })
        .then((response) => {
            console.log(`Consent was given to Email AI Filter to use Third Party Tools.`)
            // console.log(response) (Development only)
            navigate('/onboarding/form')
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                window.location.href = oAuthLoginUrl
            }
        })
})