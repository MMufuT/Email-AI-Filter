import checkLoginStatus from "./login-status";


const historyCall = (async(navigate) => {
    await checkLoginStatus(navigate)
            axios
                .get(`${process.env.REACT_APP_SERVER_URL}/history`, { withCredentials: true })
                .then((response) => {
                    setHistory(response.data.searchHistory); // Assuming 'searchHistory' is the key in your response JSON
                })
                .catch((error) => {
                    console.error(error);
                    // Handle the error appropriately
                });
})