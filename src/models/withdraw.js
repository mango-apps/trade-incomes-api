const mongoose = require('../db/main')

const WithdrawSchema = new mongoose.Schema({
  amount: {
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

  fullname: {
    type: String,
    require: true
  },

  cpf: {
    type: String,
    require: true
  },

  method: {
    type: String,
    require: true
  },

  pixKey: {
    type: String
  },

  bankAgency: {
    type: String
  },

  bankAccount: {
    type: String
  },

  bankCode: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Withdraw = mongoose.model('Withdraws', WithdrawSchema)

module.exports = Withdraw
