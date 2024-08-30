const { required } = require('joi');
const mongoose = require('mongoose');

const feedBackSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  },
  sporti:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  subject:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('sportifeedback', feedBackSchema);
