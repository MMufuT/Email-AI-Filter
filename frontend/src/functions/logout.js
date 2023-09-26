
import axios from 'axios'

/*
GET /logout API call. Used to log user out of the application
*/
const logout = (async (navigate) => {

    await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, { withCredentials: true })
        .then(() => {
            console.log(`User Sucecssfully Logged Out`)
            navigate('/')
        })
        .catch((error) => {
            console.log('Logout failed:', error)
        })

})

export default logout