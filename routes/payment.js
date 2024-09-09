const express = require('express');
const Payment = require('../models/payment');
const payment = require('../models/payment');
const servicesBooking = require('../models/servicesBooking');
const routes = express.Router();

routes.post('/success/info', async (req, res) => {
    const data = req.body;
    try {
        // Save the payment information
        const newPayment = new payment(data);
        await newPayment.save();

        // Find the booking using applicationNo
        const booking = await servicesBooking.findOne({ applicationNo: data.applicationNo });
        if (booking) {
            // Update the payment status and save the booking
            booking.paymentStatus = "success";
            await booking.save();  // Save the updated booking
        } else {
            throw new Error("Booking not found");
        }

        // Respond with success
        res.status(200).json({
            message: 'Payment info saved successfully',
            paymentInfo: data
        });
    } catch (error) {
        // Respond with error and a 500 status code
        res.status(500).json({
            message: 'Payment info failed to save.',
            error: error.message
        });
    }
});

routes.get('/list', async(req, res)=>{
    try {
        const allPayments = await payment.find();
        res.status(200).json({
            message:"success",
            data:allPayments
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
            data:error
        })
    }
})

module.exports = routes;