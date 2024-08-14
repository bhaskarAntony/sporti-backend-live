const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bhaskarbabucm6@gmail.com',
        pass: 'gnqgfyqufkzwrjwg'
    }
});

exports.sendConfirmationEmail = (formData) => {
    const mailOptions = {
        from: 'bhaskarbabucm6@gmail.com',
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
                        <p>Dear <strong>${formData.username}</strong>,</p>
                        <p>  Your booking request has been approved from admin team. Thank you. Please contact SPORTI team for</p>
                       
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
        from: 'bhaskarbabucm6@gmail.com',
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
        from: 'bhaskarbabucm6@gmail.com',
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
                    from: 'bhaskarbabucm6@gmail.com',
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