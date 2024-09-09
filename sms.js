// app.js (or index.js)
const axios = require('axios');
const crypto = require('crypto');

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};
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

const sendSMSConfirmRoom = async (FormData) => {
    try {
        const checkInDate = formatDate(FormData.checkIn);
        const checkOutDate = formatDate(FormData.checkOut);
        
       if(FormData.sporti == 'SPORTI-1'){
        await sendSingleSMS(
            `Dear Sir/Madam, Thank you for booking at SPORTI. Here are the details: Room No:${FormData.selectedRoomNumber} Check-in Date:${checkInDate} Check-out Date:${checkOutDate} Wish you a pleasant stay! For any queries, please contact us at +91 8618363693. Thank you, Team SPORTI -POLMES`,
            FormData.phoneNumber,
            '1107172536411064733'
        );
       }else{
        await sendSingleSMS(
            `Dear Sir/Madam, Thank you for booking at SPORTI. Here are the details: Room No:${FormData.selectedRoomNumber} Check-in Date:${checkInDate} Check-out Date:${checkOutDate}Wish you a pleasant stay! For any queries, please contact us at +91 8277945903. Thank you, Team SPORTI -POLMES`,
            FormData.mobileNumber,
            '1107172536402943050'
        );
       }
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

const confirmRoom = async(FormData) =>{
    const checkInDate = formatDate(FormData.checkIn);
    const checkOutDate = formatDate(FormData.checkOut);
    try {
        await sendSingleSMS(`Dear Sir/Madam,Greetings from SPORTI, Bengaluru ! Your ROOM BOOKING request has been successfully accepted. Here are details of the accommodation:No of Rooms :${FormData.noGuests} Room no-207 ${FormData.selectedRoomNumber} Check in Date -${checkOutDate}Check out Date-${checkOutDate} Please feel free to reach us on +91-8277945903 /080-22942137 Thank You for booking with us. We wish you a pleasant stay! Team SPORTI. -POLMES`, FormData.phoneNumber, '1107172431076311372')
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

const confirmMainFunctionHall = async(phonenumber) =>{
    try {
        await sendSingleSMS(`Dear Sir/Madam, Greetings from SPORTI, Bengaluru!Your booking request for MAIN FUNCTION HALL  has been received and is under evaluation. It takes 24 hours for confirmation. Booking confirmation SMS will be sent to registered mobile number and mail-id.PLEASE WAIT FOR CONFIRMATION SMS.Thank You - TEAM SPORTI.-POLMES`, phonenumber, '1107172431217567465')
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}  

const bookRoomSMS = async(phonenumber) =>{
    try {
        await sendSingleSMS(`Dear Sir/Madam, Greetings from SPORTI, Bengaluru ! Your ROOM BOOKING request has been received and is under evaluation. It takes 24 hours for confirmation. Booking confirmation SMS will be sent to registered mobile number and mail-id.PLEASE WAIT FOR CONFIRMATION SMS.Thank You - TEAM SPORTI.`, phonenumber, '1107172431016212287')
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}  



//reject sms
const rejectRoomBookingSMS = async(phonenumber) =>{
    try {
        await sendSingleSMS(`Dear Sir/Madam,Greetings from SPORTI, Bengaluru! We regret to inform you that your ROOM BOOKING request cannot be processed at the moment due to non-availability of rooms during the selected dates.We are sorry for inconvenience. Please select different dates and try again later. For any assistance please contact SPORTI Helpdesk -  +91- 8277945903 / 080-22942137.-TEAM SPORTI-POLMES`, phonenumber, '1107172431095757325')
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}  

//reject sms
const RoomPaymentSMS = async(FormData) =>{
    try {
        // Sending SMS using the template placeholders {#var#}{#var#}
        await sendSingleSMS(
            `Dear Sir/Madam, Thank you for choosing to stay at SPORTI. To secure your booking at SPORTI, please complete the payment using the link below: 
            ${FormData.applicationNo} https://sporti}. 
            Your booking will be confirmed once payment is received and room availability is verified. 
            Thank you, Team SPORTI -POLMES`, 
            FormData.mobileNumber, 
            '1107172536452274817',  // Template ID
           
        );
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



module.exports = {sendPendingSMS, sendRejectSMS, sendSMSConfirmRoom, sendSMSConfirmService, confirmRoom, confirmMainFunctionHall, bookRoomSMS, rejectRoomBookingSMS}
// sendSMSConfirmService('9481090986', '01/01/2024')
// sendSMSConfirmRoom({
//     username: "Bn",
//     mobileNumber: "9606729320",
//     sporti: "SPORTI-2",
//     checkIn: "2024-08-21T15:43:00.000Z",
//     checkOut: "2024-08-22T15:43:00.000Z",
//     selectedRoomNumber: "03"
// })
// rejectRoomBookingSMS('9606729320')
// Example call to RoomPaymentSMS
// RoomPaymentSMS({
//     username: "Bn",
//     mobileNumber: "9606729320", // Correct mobile number field
//     sporti: "SPORTI-2",
//     checkIn: "2024-08-21T15:43:00.000Z",
//     checkOut: "2024-08-22T15:43:00.000Z",
//     selectedRoomNumber: "03",
//     applicationNo: '145033e2c' // Application number for the payment link
// });