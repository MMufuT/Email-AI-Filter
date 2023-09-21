import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const patchFilterPreferences = (async (navigate) => {
    await axios(`${process.env.REACT_APP_SERVER_URL}/onboarding/reset`, {
        method: "patch",
        withCredentials: true
    })
        .then((response) => {
            console.log(response)
            navigate('/onboarding/form')
        })
        .catch((error) => {
            const errorMessage = error.response.data.mssg

            if (errorMessage === "User is not onboarded") {
                // If user is not onboarded, navigate to the onboarding form
                navigate('/onboarding/form')
            }
            else if (error.response.status === 503) {
                console.log('toast')
                toast.error("Your database is currently being loaded. Please try again in a few minutes.");
            } else {
                // If user is unauthorized (not logged in), redirect to Google OAuth login
                window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL;
            }
        });
})

export default patchFilterPreferences