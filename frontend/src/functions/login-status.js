/*
This should be used only on the /search, /history, and /account pages. This is because all other pages come before the ones listed and are part of the
onboarding process. Therefore they have their own custom status checkers defined withim the page files
*/

import axios from 'axios'

const checkLoginStatus = (async (navigate) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/login-status`, { withCredentials: true })
        .then((response) => {
            // If user is authorized (logged in), no action needed
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data.mssg;
                
                if (errorMessage === "User is not onboarded") {
                    // If user is not onboarded, navigate to the onboarding form
                    navigate('/onboarding/form');
                  } else {
                    // If user is unauthorized (not logged in), redirect to Google OAuth login
                    window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL;
                  }
            }
        });
})

  export default checkLoginStatus