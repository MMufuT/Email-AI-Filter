
import axios from 'axios'
const serverUrl = process.env.REACT_APP_SERVER_URL

/*
GET /logout API call. Used to log user out of the application
*/
const logout = (async (navigate) => {

    await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true })
        .then(() => {
            console.log(`User Sucecssfully Logged Out`)
            navigate('/')
        })
        .catch((error) => {
            console.log('Logout failed')
        })

})

export default logout