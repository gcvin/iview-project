const mongoose = require('../lib/db.js')

const UserSchema = new mongoose.Schema({
  userName: { type: String },
  userAddr: { type: String },
  userAge: { type: Number },
  loginDate: { type: Date }
})

module.exports = mongoose.model('User', UserSchema)
