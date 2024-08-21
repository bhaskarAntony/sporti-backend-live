// app.js (or index.js)
const axios = require('axios');
const crypto = require('crypto');


// Route to handle SMS sending
const sendPendingSMS = async ( mobileNumber) => {
    try {
         await sendSingleSMS('Dear Sir, Your booking request has been submitted to the SPORTI team for evaluation. It typically takes 24 hours for confirmation. Please wait for the confirmation SMS.-POLMES', mobileNumber, '1107172406279285786');
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

const sendRejectSMS = async (mobileNumber) => {
    try {
         await sendSingleSMS('Dear Sir/Madam, Due to the non-availability of rooms during the selected period, your booking request cannot be processed. Sorry for the inconvenience. Please contact the SPORTI helpdesk for further assistance at +91-8277945903 / 080-22942137. -POLMES', mobileNumber, '1107172406298441076');
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

const sendSMSConfirmRoom = async (mobileNumber, checkIn, checkOut) => {
    try {
         await sendSingleSMS(`Dear Sir,Greetings from SPORTI Bengaluru! Thank you for booking with us. Here are the details of your accommodation:No of Rooms: 01,Room No: 207,Check-in Date:${checkIn},Check-out Date: ${checkOut} Please feel free to reach us at +91-8277945903 / 080-22942137.We wish you a pleasant stay!. Team SPORTI`, mobileNumber, '1107172406257095270');
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

const sendSMSConfirmService = async (mobileNumber, date,) => {
    try {
         await sendSingleSMS(`Hello. Welcome to SPORTI-1/ SPORTI-2. Your Room/Event/Conference Hall booking is confirmed on ${date}. Please contact SPORTI-1/SPORTI-2 Helpline +91-8277945903 / 080-22942137 for more details. -POLMES`, mobileNumber, '1107171558116424470');
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

// Function to send a single SMS
async function sendSingleSMS(message, mobileNumber, templateId) {
    let responseString = "";
    const url = "http://smsmobile1.karnataka.gov.in/index.php/sendmsg";
    const encryptedPassword = SHA1('POLMES@1234'); // Updated to use SHA-1
    const generatedHashKey = hashGenerator('Mobile_1-POLMES', 'POLMES', message, '6f420626-1666-4f1a-b986-0cc8e20c3a77');

    try {
        const params = {
            mobileno: mobileNumber,
            senderid: 'POLMES',
            content: message,
            smsservicetype: "singlemsg",
            username: 'Mobile_1-POLMES',
            password: encryptedPassword,
            key: generatedHashKey,
            templateid: templateId
        };

        const response = await axios.post(url, params);
        responseString = response.data;
        console.log(responseString);
        return responseString;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

// Hash generator function
function hashGenerator(userName, senderId, content, secureKey) {
    const hashGen = `${userName.trim()}${senderId.trim()}${content.trim()}${secureKey.trim()}`;
    const hash = crypto.createHash('sha512').update(hashGen).digest('hex');
    return hash;
}

// MD5 hash function
function SHA1(data) {
    return crypto.createHash('sha1').update(data).digest('hex');
}



module.exports = {sendPendingSMS, sendRejectSMS, sendSMSConfirmRoom, sendSMSConfirmService}
// sendSMSConfirmService('9606729320', '01/01/2024')

