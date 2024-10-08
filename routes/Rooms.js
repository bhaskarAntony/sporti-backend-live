const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

const roomData = {
    "SPORTI-1": {
        "GROUND FLOOR": {
            Standard: ["102", "103", "104", "105", "106"],
        },
        "FIRST FLOOR": {
            Standard: ["204", "205", "206", "207", "208", "209", "210", "211"],
            VIP: ["201", "202"],
            Family: ["203"],
        },
    },
    "SPORTI-2": {
        "GROUND FLOOR": {
            VIP: ["01", "02", "03"],
        },
        "FIRST FLOOR": {
            Standard: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114"],
        },
    },
};

// Fetch available rooms based on room type and building
router.get('/available/rooms', async (req, res) => {
    try {
        const { roomType, sporti } = req.query;
        const availableRooms = await Room.find({
            category: roomType,
            // isBooked: false,
            sporti: sporti,
        });

        res.json(availableRooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/all/rooms', async(req, res)=>{
    try {
        const allrooms = await Room.find();
        res.status(200).json({
            message:'success',
            data:allrooms
        })
    } catch (error) {
        res.status(404).json({
            message:error.message,
            data:error
        })
    }
})

router.post('/clear/room/:id', async(req, res)=>{
    const {id} = req.params.id;
   try {
    const room = await Room.findById(req.params.id);
    if(!room){
        return  res.status(404).json({
            message:"Room id not found",
            data:room
        })
    }
    room.isBooked = false;
    room.save();
    res.status(200).json({
        message:"Room is cleared",
        data:room
    })
   } catch (error) {
    res.status(404).json({
        message:"Room is cleared",
        data:error
    })
   }
})

router.post('/block/room/:id', async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
  
      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }
  
      room.isBooked = true; // Block the room by setting isBooked to true
      await room.save();
  
      res.status(200).json({
        message: "Room blocked successfully",
        data: room,
      });
    } catch (error) {
      res.status(500).json({
        message: "Room blocking failed",
        data: error,
      });
    }
  });


router.post('/upload-rooms', async (req, res) => {
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
        res.status(200).json({ message: 'Rooms uploaded successfully!' });
    } catch (error) {
        console.error('Error uploading rooms:', error.message);
        res.status(500).json({ message: 'An error occurred while uploading rooms.' });
    }
});

module.exports = router;
