const mongoose = require('../db/main')

const FundsSchema = new mongoose.Schema({
  invested: {
    type: Number,
    default: 0
  },

  gained: {
    type: Number,
    default: 0
  },

  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },

  status: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Funds = mongoose.model('Funds', FundsSchema)

module.exports = Funds
