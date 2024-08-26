const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: String,
    category: String, // e.g., 'VIP', 'Executive', 'Family'
    floor: String,    // e.g., 'GROUND FLOOR', 'FIRST FLOOR'
    sporti: String,   // e.g., 'SPORTI-1', 'SPORTI-2'
    isBooked: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Room', RoomSchema);
