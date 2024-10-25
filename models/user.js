const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender:String,
  mobilenumber:String,
  designation:String,
  workingstatus:String,
  officialaddress:String,
  personalmobilenumber:String,
  idCardNo:String
});

module.exports = mongoose.model('Sportiusers', userSchema);
