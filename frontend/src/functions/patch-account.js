import axios from 'axios'

/*
PATCH /PATCH API call. Used to update user's gmailLinkId
*/
const patchAccount = (async (account, setAccount, tempGmailLinkId, navigate) => {
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}/account/update`, {gmailLinkId: tempGmailLinkId}, { withCredentials: true })
        .then((response) => {
            setAccount({
                ...account,
                gmailLinkId: response.data.newGmailLinkId
            })
            console.log('Changes saved successfully')
        })
        .catch((error) => {
            const errorMessage = error.response.data.mssg

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

export default patchAccount