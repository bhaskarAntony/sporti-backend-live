const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['sporti-1', 'sporti-2', 'superadmin'], required: true },
});

module.exports = mongoose.model('User', userSchema);
