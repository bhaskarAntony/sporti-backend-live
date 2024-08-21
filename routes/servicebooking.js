const express = require('express');
const { submitServiceForm, submitRoomForm, getBookingByApplicationNo, deleteBooking, updateBooking } = require('../controllers/servicebooking');
const router = express.Router();
const Booking = require('../models/servicesBooking');
const { sendrejectionEmail, sendConfirmationEmail } = require('../services/emailService');
const sendSMS = require('../s');
const { sendRejectSMS, sendSMSConfirmService } = require('../sms');

router.post('/service/book', submitServiceForm);
router.post('/room/book', submitRoomForm);
router.get('/booking/:applicationNo', getBookingByApplicationNo);
router.delete('/delete/booking/:applicationNo', deleteBooking);
router.put('/update/booking/:applicationNo', updateBooking);
// routes/bookings.js

// Reject a booking
router.patch('/:id/reject', async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.status = 'rejected';
        booking.rejectionReason = rejectionReason;
        sendrejectionEmail(booking)
        // sendSMS(`Hello ${booking.username},   Your booking request has been cancelled from admin team as you are not eligible for booking services in SPORTI. Thank you.`, booking.phoneNumber)
        sendRejectSMS(booking.phoneNumber);
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/resend/:phone/:name/:applicationNo', async() => {
    const data = req.paramas;
    try{
        await sendSMS(`hello ${data.name}, Your booking request has been approved from admin team. Thank you. Please contact SPORTI team for ${data.applicationNo}`, data.phone);
        res.status(200).json({message:"sms done"});
    }catch(err){
        res.status(500).json({message:'not send', error:err})
    }
})

// Confirm a booking
router.patch('/:id/confirm', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'confirmed';
        // sendConfirmationEmail(booking)
        sendSMS(`Hello ${booking.username}, Your booking request has been approved from admin team. Thank you. Please contact SPORTI team for`, booking.phoneNumber)
        sendSMSConfirmService(booking.phoneNumber, booking.eventdate)
        await booking.save();
        // Send email to user
        // You need to implement email sending logic here
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
