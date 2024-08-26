const mongoose = require('mongoose');
const Room = require('./models/Room');

// Replace with your MongoDB connection string
const dbURI = 'mongodb+srv://bhaskarAntoty123:bhaskar3958@bhaskarantony.wagpkay.mongodb.net/?retryWrites=true&w=majority';

const roomData = {
    "SPORTI-1": {
        "GROUND FLOOR": {
            EXECUTIVE: ["102", "103", "104", "105", "106"],
        },
        "FIRST FLOOR": {
            EXECUTIVE: ["204", "205", "206", "207", "208", "209", "210", "211"],
            "VIP ROOMS": ["201", "202"],
            "FAMILY ROOM": ["203"],
        },
    },
    "SPORTI-2": {
        "GROUND FLOOR": {
            VIP: ["01", "02", "03"],
        },
        "FIRST FLOOR": {
            EXECUTIVE: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114"],
        },
    },
};

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        uploadRooms();
    })
    .catch(err => console.error('MongoDB connection error:', err));

async function uploadRooms() {
    try {
        const roomsToUpload = [];

        for (const sporti in roomData) {
            for (const floor in roomData[sporti]) {
                for (const category in roomData[sporti][floor]) {
                    const rooms = roomData[sporti][floor][category];
                    rooms.forEach(roomNumber => {
                        roomsToUpload.push({
                            roomNumber,
                            category,
                            floor,
                            sporti,
                        });
                    });
                }
            }
        }

        await Room.insertMany(roomsToUpload);
        console.log('Rooms uploaded successfully!');
    } catch (error) {
        console.error('Error uploading rooms:', error.message);
    } finally {
        mongoose.connection.close();
    }
}
