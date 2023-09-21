import axios from 'axios'

const getAccount = (async (navigate, setAccount, setTempGmailLinkId) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/account`, { withCredentials: true })
    .then((response) => {
        setAccount(response.data.accountInfo)
        setTempGmailLinkId(response.data.accountInfo.gmailLinkId)
    })
    .catch((error) => {
        if (error.response && error.response.status === 401) {
            const errorMessage = error.response.data.mssg
            
            if (errorMessage === "User is not onboarded") {
                // If user is not onboarded, navigate to the onboarding form
                navigate('/onboarding/form')
              }
              else {
                // If user is unauthorized (not logged in), redirect to Google OAuth login
                window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
            }
        }
    })
})


export default getAccount