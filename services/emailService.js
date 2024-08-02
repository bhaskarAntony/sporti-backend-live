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
                        <p>Your booking request for the dates <strong>${formData.checkIn}</strong> to <strong>${formData.checkout}</strong> has been confirmed.</p>
                        <p>We look forward to welcoming you.</p>
                        <h1>You can complete the payment</h1>
                        <a href="https://new-spoorti.vercel.app/payment/562382485">Pay now</a>
                    </div>
                    <div class="footer">
                        <p>Thank you for choosing our services!</p>
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
                    <p>Your booking request for the dates <strong>${formData.checkIn}</strong> to <strong>${formData.checkout}</strong> has been Rejected.</p>
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