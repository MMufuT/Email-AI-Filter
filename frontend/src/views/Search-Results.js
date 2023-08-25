import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, { useRef, useEffect, useState } from 'react';
import magGlass from '../smartfilter128.png';
import axios from 'axios'

const SearchResults = ({ match }) => {

    const [results, setResults] = useState([]);
    const query = match.params.query; // Retrieve the query parameter from the URL

    const searchConfig = {
        query: query,
        senderAddress: null, // or specify an email address
        range: { before: null, after: null } // specify the range if needed
      };
  
    useEffect(() => {
      // Fetch search results based on the query parameter
      axios.get(`https://your-api-url/search?q=${query}`)
        .then(response => {
          // Set the search results in the state
          setResults(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }, [query]); // Make sure to include query in the dependency array
  
    return (
      <div>
        {/* Display the search results here */}
      </div>
    );


}

export default SearchResults