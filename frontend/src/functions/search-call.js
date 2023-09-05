import axios from 'axios'
import convertStringToUnixTimestamp from '../functions/string-to-unix';
import checkLoginStatus from './login-status';

const searchCall = (async (navigate, location, setResults, setSearchConfig) => {

    await checkLoginStatus(navigate)

    const searchParams = new URLSearchParams(location.search);

    const searchConfig = {
        query: searchParams.get('query'),
        senderAddress: searchParams.get('sender'), // or specify an email address
        range: {
            before: convertStringToUnixTimestamp(searchParams.get('before')),
            after: convertStringToUnixTimestamp(searchParams.get('after'))
        }
    };

    axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, searchConfig, { withCredentials: true })
        .then((response) => {
            setResults(response.data.results)
            setSearchConfig(response.data.searchConfig)
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        });
})




export default searchCall