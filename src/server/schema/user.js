import mongoose from '../lib/db.js'

const UserSchema = new mongoose.Schema({
  userName: { type: String },
  userAddr: { type: String },
  userAge: { type: Number },
  loginDate: { type: Date }
})

export default mongoose.model('User', UserSchema)
