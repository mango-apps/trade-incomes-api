const mongoose = require('../db/main')

const WithdrawSchema = new mongoose.Schema({
  Withdraw: {
    type: Number,
    required: true
  },

  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },

  fundToWithdraw: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funds',
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

const Withdraw = mongoose.model('Withdraws', WithdrawSchema)

module.exports = Withdraw
