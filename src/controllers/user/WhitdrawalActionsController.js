const User = require('../../models/user')
const Fund = require('../../models/fund')
const Withdraw = require('../../models/withdraw')
const ObjectId = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')

const createWithdraw = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const session = jwt.verify(token, process.env.SECRET_KEY)

  const { idFund, value } = req.body

  try {
    if (!ObjectId.isValid(idFund)) {
      return res.status(400).json({ error: 'ObjectID malformatted' })
    }

    const user = await User.findOne({ email: session.email })

    const fund = await Fund.findById(idFund)

    if (!fund) {
      return res.status(404).json({ error: 'Fund not found' })
    }

    if (fund.status == 1) {
      return res.status(404).json({ error: 'Pending Withdrawal' })
    }

    if (fund.gained < value) {
      return res
        .status(404)
        .json({ error: 'withdraw more than available amount' })
    }

    const resultFundUpdate = await Fund.updateOne(
      { _id: fund._id },
      {
        status: 1
      }
    )

    if (!resultFundUpdate)
      return res.status(400).json({ error: 'Cannot update status fund' })

    const withdraw = await Withdraw.create({
      Withdraw: value,
      fundToWithdraw: fund._id,
      userOwner: user._id
    })

    return res.json({ withdraw })
  } catch (error) {
    return res.status(400).json({ error: 'Cannot withdraw funds' })
  }
}

const withdrawFundIndex = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const session = jwt.verify(token, process.env.SECRET_KEY)
  const { status } = req.params

  try {
    const user = await User.findOne({ email: session.email })

    let withdraws = await Withdraw.find({ userOwner: user._id })

    if (status)
      withdraws = withdraws.filter(
        withdraw => withdraw.status === parseInt(status)
      )

    if (withdraws.length) {
      return res.json({ withdraws })
    } else {
      return res.status(404).json({ error: 'No Withdraws founded' })
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: `Cannot search for User's withdraws` })
  }
}

module.exports = {
  createWithdraw,
  withdrawFundIndex
}
