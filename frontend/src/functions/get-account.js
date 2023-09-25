import axios from 'axios'

/*
GET /account API call. Used to get user's account information
*/
const getAccount = (async (navigate, setAccount, setTempGmailLinkId) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/account`, { withCredentials: true })
    .then((response) => {
        setAccount(response.data.accountInfo)
        setTempGmailLinkId(response.data.accountInfo.gmailLinkId)
    })
    .catch((error) => {
        if (error.response && error.response.status === 409) {
            const errorMessage = error.response.data.mssg

            if (errorMessage === "User is not onboarded") {
                // If user is not onboarded, navigate to the onboarding form
                navigate('/onboarding/form')

            }
        }
        else if (error.response && error.response.status === 401) {
            window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
        }
    })
})


export default getAccount