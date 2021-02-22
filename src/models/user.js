const mongoose = require('../db/main')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },

  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    require: true
  },

  cpf: {
    type: String,
    require: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  admin: {
    type: Boolean,
    default: false
  },

  resetPassToken: {
    type: String,
    select: false
  },

  resetPassExp: {
    type: Date,
    select: false
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
