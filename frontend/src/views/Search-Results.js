import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import magGlass from '../smartfilter128.png';
import axios from 'axios'

const SearchResults = () => {

  const convertStringToUnixTimestamp = ((dateString) =>  {
    const dateObject = new Date(dateString);
    const unixTimestamp = dateObject.getTime() / 1000; // Convert to seconds
    return unixTimestamp;
  })

  const [results, setResults] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

    const sender = searchParams.get('sender');
    const before = searchParams.get('before');
    const after = searchParams.get('after');

  const searchConfig = {
    query: searchParams.get('query'),
    senderAddress: searchParams.get('sender'), // or specify an email address
    range: {
      before: convertStringToUnixTimestamp(searchParams.get('before')),
      after: convertStringToUnixTimestamp(searchParams.get('after'))
    } // specify the range if needed
  };

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, searchConfig, { withCredentials: true })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            });
}, []);

  return (
    <div>
      <h1>hekooooo</h1>
    </div>
  );


}

export default SearchResults
