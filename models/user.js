const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], default: '' },
  mobilenumber: { type: String, default: '' },
  designation: { type: String, default: '' },
  workingstatus: { type: String, enum: ['Retired', 'Serving'], default: '' },
  officialaddress: { type: String, default: '' },
  personalmobilenumber: { type: String, default: '' },
  idCardNo: { type: String, default: '' },
  firstName: { type: String, default: '' },
  middleName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  educationalQualification: { type: String, default: '' },
  homeAddress: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  aadhaarNumber: { type: String, default: '' },
  kgidNo: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  otherClubsMembership: { type: String, default: '' },
  interests: { type: String, default: '' }, // Storing as a comma-separated string
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the `updatedAt` field on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Sportiusers', userSchema);