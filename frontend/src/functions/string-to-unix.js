/*
This function takes in a date string that is selected by the user via the filter button. The date string is returned by the datepicker module and it is 
the job of this function to convert the string date into a unix timestamp so that the api can understand the before/after filters
*/

const convertStringToUnixTimestamp = ((dateString) => {
    const dateObject = new Date(dateString);
    const unixTimestamp = dateObject.getTime() / 1000; // Convert to seconds
    return unixTimestamp;
  })
  
  export default convertStringToUnixTimestamp