const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
   name:{
    type:String,
    required:true
   },
   applicationNo:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   phoneNumber:{
    type:String,
    required:true
   },
   productInfo:{
    type:String,
    required:true
   },
   amount:{
    type:String,
    required:true
   }
});

module.exports = mongoose.model('onlinePayments', PaymentSchema);
