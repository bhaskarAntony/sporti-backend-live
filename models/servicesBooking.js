const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    username: String,
    email: String,
    officerDesignation:String,
    officerCadre:String,
    phoneNumber: String,
    applicationNo: { type: String},
    sporti: String,
    checkIn: Date,
    checkOut: Date,
    serviceName: String,
    eventdate:String,
    serviceType: String,
    roomType:String,
    noRooms:String,
    guestType:String,
    paymentStatus: {
        type: String,
    },
    totalCost:String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'], // Add 'rejected' status
        default: 'pending',
    },
    rejectionReason: { // New field for rejection reason
        type: String,
        default: '',
    },
    numberOfDays:{
        type:Number,
        default:0
    },
    selectedRoomNumber:{
        type:String,
    },
    roomId:{
        type:String,
    },
    lastCheckOut:{
        type:String,
    },
    isCheckout:{
        type:Boolean
    }

});

module.exports = mongoose.model('SportiServicebookings', BookingSchema);
