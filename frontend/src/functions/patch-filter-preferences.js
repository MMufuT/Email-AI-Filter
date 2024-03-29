import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const oAuthLoginUrl = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
const serverUrl = process.env.REACT_APP_SERVER_URL

/*
PATCH /reset API call. Used to reset onboarding process by:
    1. Setting user's onboarded status to false
    2. Redirecting user to /onboarding/form
*/

//(temporary disabled for the sake of CASA)
const patchFilterPreferences = (async (navigate) => {
    await axios(`${serverUrl}/onboarding/reset`, {
        method: "patch",
        withCredentials: true
    })
        .then((response) => {
            console.log('Preferences reset successfully')
            navigate('/onboarding/form')
        })
        .catch((error) => {
            const errorMessage = error.response.data.mssg

            if (errorMessage === "User is not onboarded") {
                navigate('/onboarding/form')
            }
            else if (error.response.status === 503) {
                console.log('toast')
                toast.error("Your database is currently being loaded. Please try again in a few minutes.");
            }
            else if (error.response.status === 401) {
                window.location.href = oAuthLoginUrl
            }
        })
})

export default patchFilterPreferences