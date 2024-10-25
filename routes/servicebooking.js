const express = require('express');
const { submitServiceForm, submitRoomForm, getBookingByApplicationNo, deleteBooking, updateBooking } = require('../controllers/servicebooking');
const router = express.Router();
const Booking = require('../models/servicesBooking');
const { sendrejectionEmail, sendConfirmationEmail, sendRoomConfirmationEmail, sendRoomRejectEmail, sendPaymentEmail } = require('../services/emailService');
const sendSMS = require('../s');
const { sendRejectSMS, sendSMSConfirmService, sendSMSConfirmRoom, confirmRoom, rejectRoomBookingSMS } = require('../sms');
const Room = require('../models/Room');

router.post('/service/book', submitServiceForm);
router.post('/room/book', submitRoomForm);
router.get('/booking/:applicationNo', getBookingByApplicationNo);
router.delete('/delete/booking/:id', deleteBooking);
router.put('/update/booking/:applicationNo', updateBooking);
//routes/bookings.js

// Reject a booking


router.patch('/:id/reject', async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.status = 'rejected';
        booking.paymentStatus = 'pending';
        booking.rejectionReason = rejectionReason;
        // sendrejectionEmail(booking)
        // sendSMS(`Hello ${booking.username},   Your booking request has been cancelled from admin team as you are not eligible for booking services in SPORTI. Thank you.`, booking.phoneNumber)
        if(booking.serviceName == "Room Booking"){
            rejectRoomBookingSMS(booking.phoneNumber);
            sendRoomRejectEmail(booking)
        }
        await booking.save();
        const room = await Room.findById(booking.roomId);

        if(room){
            room.isBooked = false;
            room.save();
        }

       
        res.json({booking, room});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Confirm a booking
router.patch('/:id/confirm', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'confirmed';
        booking.isCheckout = false;
        booking.roomId=req.params.id;
        // sendConfirmationEmail(booking)
        // sendSMS(`Hello ${booking.username}, Your booking request has been approved from admin team. Thank you. Please contact SPORTI team for`, booking.phoneNumber)
        // const date = new Date(booking.eventdate)
        sendPaymentEmail(booking);
        sendSMSConfirmService(booking.phoneNumber, booking.eventdate);
        await booking.save();
        // Send email to user
        // You need to implement email sending logic here
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/success/payment', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.paymentStatus = 'success';
       
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/remove/payment', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Check if the booking exists
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the payment status to 'pending'
        booking.paymentStatus = 'pending';
        await booking.save();

        // Send the updated booking as a response
        res.status(200).json({
            message: 'Payment status updated to pending',
            booking
        });
    } catch (error) {
        // Handle potential errors
        res.status(500).json({ message: 'An error occurred while updating payment status', error: error.message });
    }
});

router.patch('/:id/checkout', async (req, res) => {
    const data = req.body;
    try {
        const booking = await Booking.findById(req.params.id);

        // Check if the booking exists
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the payment status to 'pending'
        booking.lastCheckOut = data.date;
        booking.isCheckout = true;
        await booking.save();
        const room = await Room.findById(booking.roomId);
        if(room){
            room.isBooked = false;
            room.save();
        }

        // Send the updated booking as a response
        res.status(200).json({
            message: 'Room CheckOut is Done',
            booking
        });
    } catch (error) {
        // Handle potential errors
        res.status(500).json({ message: 'An error occurred while check out', error: error.message });
    }
});


router.patch('/:id/select-room/:roomId', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const { roomNumber } = req.body;

        // Update booking with selected room number
        booking.selectedRoomNumber = roomNumber;
        booking.status = 'confirmed';
        booking.roomId = req.params.roomId;
        await booking.save();

        // Mark the room as booked
        var bookedRoom = await Room.findById(req.params.roomId);
        if(!bookedRoom){
            return res.status(404).json({error: 'Room id not found' });
        }
        bookedRoom.isBooked = true
        bookedRoom.save();
        sendSMSConfirmRoom(booking);
        sendRoomConfirmationEmail(booking);
        sendPaymentEmail(booking);
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
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



router.get('/send/room/sms/:id', async(req, res)=>{
    const {id} = req.params;
    try {
        const booking = await Booking.findById(req.params.id);
        confirmRoom(booking);
        res.status(200).json({
            message:"sms sent"
        })
    } catch (error) {
        res.status(500).json({
            message:"failed to send sms."
        })
    }
})

router.post('/change.room/number/:roomId/:bookingId', async(req, res) =>{
    try {
        const booking  =  await Booking.findById(req.params.bookingId)  
    } catch (error) {
        
    }
})



module.exports = router;
