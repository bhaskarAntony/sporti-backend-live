const nodemailer = require('nodemailer');

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sportigov@gmail.com',
        pass: 'tpwiaghvtskcnmwe'
    }
});

exports.sendRoomPendingEmail = (formData) => {
    const mailOptions = {
        from: 'sportigov@gmail.com',
        to: formData.email,
        subject: 'Booking Request',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Room Booking</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #ddd;
                    }
                    .header h1 {
                        margin: 0;
                    }
                    .content {
                        padding-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Room Booking Confirmation</h1>
                    </div>
                    <div class="content">
                       
                        <p><p>Dear Sir/Madam </p>

                       <h2> Warm Greetings from SPORTI! </h2>

                       <ul>
                            <li> Here are the booking request details:</li>
                            <li> Officers Name : ${formData.username}</li>
                            <li>Designation :${formData.officerDesignation} </li>
                            <li>Mobile Number :${formData.phoneNumber} </li>
                            <li> Cadre :${formData.officerCadre} </li>
                           
                            <li> Place : ${formData.sporti} </li>
                            <li> No of Rooms :1</li>
                            <li> Check-In Date :${formatDate(formData.checkIn)} </li>
                            <li>Check-Out Date :${formatDate(formData.checkout)}</li>
                            <li> No of Persons :${formData.noGuests} </li>
                            <li>Price ( Including GST ) :&#8377; ${formData.totalCost}</li>
                       </ul>
                        </p>
                        <p> Your booking request is under consideration and will be confirmed within 24 working hours based on rooms availability. </p>
                        <p> Warm Regards</p>
                        <p>Team SPORTI</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

   

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

exports.sendRoomConfirmationEmail = (formData) => {

    const mailOptions = {
        from: 'sportigov@gmail.com',
        to: formData.email,
        subject: 'Room Booking Confirmation',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Room Booking Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #ddd;
                    }
                    .header h1 {
                        margin: 0;
                    }
                    .content {
                        padding-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Room Booking Confirmation</h1>
                    </div>
                    <div class="content">
                       
                        <p>Dear Sir/Madam,Greetings from SPORTI, Bengaluru ! Your ROOM BOOKING request has been successfully accepted. Here are details of the accommodation:No of Rooms : 1 Room no- ${formData.selectedRoomNumber} Check in Date -${formatDate(formData.checkIn)} Check out Date-${formatDate(formData.checkOut)} Please feel free to reach us on +91-8277945903 /080-22942137 Thank You for booking with us. We wish you a pleasant stay! Team SPORTI. -POLMES</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

   

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

exports.sendRoomRejectEmail = (formData) => {
    const mailOptions = {
        from: 'sportigov@gmail.com',
        to: formData.email,
        subject: 'Room Booking Rejection',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Room Booking Rejection</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #ddd;
                    }
                    .header h1 {
                        margin: 0;
                    }
                    .content {
                        padding-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Room Booking Rejection</h1>
                    </div>
                    <div class="content">
                       
                        <p>Dear Sir/Madam,Greetings from SPORTI, Bengaluru! We regret to inform you that your ROOM BOOKING request cannot be processed at the moment due to non-availability of rooms during the selected dates.We are sorry for inconvenience. Please select different dates and try again later. For any assistance please contact SPORTI Helpdesk -  +91- 8277945903 / 080-22942137.-TEAM SPORTI-POLMES</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

   

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

exports.sendServiceConfirmationEmail = (formData) => {
    const mailOptions = {
        from: 'sportigov@gmail.com',
        to: formData.email,
        subject: 'Booking Confirmation',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #ddd;
                    }
                    .header h1 {
                        margin: 0;
                    }
                    .content {
                        padding-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Booking Confirmation</h1>
                    </div>
                    <div class="content">
                    <h1>Dear Sir,</h1>
                        <p>Dear <strong>Greetings from SPORTI Bengaluru ! </strong>,</p>
                        <p>Thank you for booking with us. Here are details of the accommodation:</p>
                        <p>Check in Date: <strong>${formData.checkIn}</strong>/p>
                        <p>Check out Date: <strong>${formData.checkIn}</strong></p>
                        <p>Please feel free to reach us on +91-8277945903 / 080-22942137</p>
                        <h1>We wish you a pleasant stay! </h1>
                       
                    </div>
                    <div class="footer">
                        <p>Team SPORTI</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

   

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};



exports.sendrejectionEmail = (formData) => {
    const mailOptions1 = {
        from: 'sportigov@gmail.com',
        to: formData.email,
        subject: 'Booking Rejection',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Rejection</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #ddd;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding-top: 20px;
                }
                .footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Booking Confirmation</h1>
                </div>
                <div class="content">
                    <p>hello,  <strong>${formData.username}</strong>,</p>
                    <p>Dear Sir/Madam, 
Due to non availability of rooms during the selected period,your booking request cannot be processed.
Sorry for the inconvenience. Please contact SPORTI helpdesk for further assistance.</p>
                    <p>rejection reason ${formData.rejectionReason}</p>
            
                </div>
                <div class="footer">
                    <p>Thank you for choosing our services!</p>
                </div>
            </div>
        </body>
        </html>
    `
    };

    transporter.sendMail(mailOptions1, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });


               }
exports.sendPendingEmail = (formData) => {
                const mailOptions1 = {
                    from: 'sportigov@gmail.com',
                    to: formData.email,
                    subject: 'Booking Information',
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Booking Requested</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ddd;
                                border-radius: 5px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                text-align: center;
                                padding-bottom: 20px;
                                border-bottom: 1px solid #ddd;
                            }
                            .header h1 {
                                margin: 0;
                            }
                            .content {
                                padding-top: 20px;
                            }
                            .footer {
                                text-align: center;
                                padding-top: 20px;
                                border-top: 1px solid #ddd;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Booking Confirmation</h1>
                            </div>
                            <div class="content">
                                <p>Dear <strong>${formData.username}</strong>,</p>
                                <p>Your booking request for the dates <strong>${formData.checkIn}</strong> to <strong>${formData.checkout}</strong> has been requested.</p>
                                <p>Your booking request is being reviewed by SPORTI team. You will receive a text message shortly after confirmation.
                                </p>
                              
                            </div>
                            <div class="footer">
                                <p>Thank you for choosing our services!</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `                  
                };
            
                transporter.sendMail(mailOptions1, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            }

            exports.sendPaymentEmail = (formData) => {
                const mailOptions1 = {
                    from: 'sportigov@gmail.com',
                    to: 'bhaskarbabucm6@gmail.com',
                    subject: 'Payment Link',
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Payment Link</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ddd;
                                border-radius: 5px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                text-align: center;
                                padding-bottom: 20px;
                                border-bottom: 1px solid #ddd;
                            }
                            .header h1 {
                                margin: 0;
                            }
                            .content {
                                padding-top: 20px;
                            }
                            .footer {
                                text-align: center;
                                padding-top: 20px;
                                border-top: 1px solid #ddd;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Online Payment For Your Booking</h1>
                            </div>
                            <div class="content">
                                <p>Dear <strong>${formData.username}</strong>,</p>
                                <p>Dear Sir/Madam, Thank you for choosing to stay at SPORTI. To secure your booking at SPORTI, please complete the payment using the link below: 
                                <a href=${`https://sporti.ksp.gov.in/payment/${formData.applicationNo}`}>Pay Now</a>. 
                                Your booking will be confirmed once payment is received and room availability is verified. 
                                Thank you, Team SPORTI -POLMES</p>
                            </div>
                            <div class="footer">
                                <p>Thank you</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `                  
                };
            
                transporter.sendMail(mailOptions1, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            }