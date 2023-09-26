import axios from 'axios'

/*
DELETE /account/delete API call. Used to delete user's account
*/
const deleteAccount = (async (navigate) => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/account/delete`, { withCredentials: true })
        .then((response) => {
            console.log(`Account was successfully deleted:`)
            // console.log(response) (Development only)
            navigate('/')
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
            }
        })
})

export default deleteAccount