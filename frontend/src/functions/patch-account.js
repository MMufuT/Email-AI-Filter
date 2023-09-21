import axios from 'axios'

const patchAccount = (async (account, setAccount, tempGmailLinkId, navigate) => {
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}/account/update`, {gmailLinkId: tempGmailLinkId}, { withCredentials: true })
        .then((response) => {
            setAccount({
                ...account,
                gmailLinkId: response.data.newGmailLinkId
            })
            console.log(response.data)
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

export default patchAccount