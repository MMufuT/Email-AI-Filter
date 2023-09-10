/* 
When the user clicks the search button or 'enter', this function redirects the user to the search results route via a dynamic url that contains all of the users
search criteria
*/


const searchRedirect = (navigate, query, sender, before, after) => {
    if (!query) return
    navigate(`/search/results?query=${encodeURIComponent(query)}&sender=${encodeURIComponent(sender)}&before=${before}&after=${after}`)
};

export default searchRedirect