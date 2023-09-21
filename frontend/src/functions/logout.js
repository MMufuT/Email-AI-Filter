
import axios from 'axios'

const logout = (async (navigate) => {

    await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, { withCredentials: true })
        .then(() => {
            navigate('/')
        })
        .catch((error) => {
            console.log('Logout failed:', error)
        })

})

export default logout