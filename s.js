const axios = require('axios');
require('dotenv').config(); // Load environment variables from a .env file

// Define the URL for the Fast2SMS API from an environment variable
const url = process.env.FAST2SMS_API_URL || 'https://www.fast2sms.com/dev/bulkV2'; 

// Define the headers for the request
const sendSMS = (message, number) => {
    // Check if API key and other required environment variables are set
    if (!process.env.FAST2SMS_API_KEY) {
        console.error('API key is not set in environment variables');
        return;
    }

    if (!message || !number) {
        console.error('Message and number parameters are required');
        return;
    }

    const headers = {
        'authorization': process.env.FAST2SMS_API_KEY, // Use environment variable for API key
        'Content-Type': 'application/json'
    };
      
    // Define the JSON body for the request
    const data = {
        route: 'q',
        message: message,
        flash: 0,
        numbers: number  // Replace with actual phone numbers
    };
      
    // Send the POST request
    axios.post(url, data, { headers })
        .then(response => {
            console.log('Status Code:', response.status);
            console.log('Response Body:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });
};



module.exports = sendSMS;
