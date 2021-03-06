const User = require('../../models/user')
const Fund = require('../../models/fund')
const Withdraw = require('../../models/withdraw')
const ObjectId = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')

const withdrawFund = async (req, res) => {
  const { id, value } = req.body

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ObjectID malformatted' })
    }

    const fund = await Fund.findById(id)

    if (!fund) {
      return res.status(404).json({ error: 'Fund not found' })
    }

    if (fund.status) {
      return res.status(404).json({ error: 'Pending Withdrawal' })
    }

    if (fund.gained < value) {
      return res
        .status(404)
        .json({ error: 'withdraw more than available amount' })
    }

    const withdraw = await Withdraw.create({
      Withdraw: value,
      fundToWithdraw: fund._id
    })

    const resultFundUpdate = await Fund.updateOne(
      { _id: fund._id },
      {
        status: 1
      }
    )

    if (!resultFundUpdate)
      return res.status(400).json({ error: 'Cannot update status fund' })

    return res.json({ withdraw })
  } catch (error) {
    return res.status(400).json({ error: 'Cannot withdraw funds' })
  }
}

const withdrawFundIndex = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const session = jwt.verify(token, process.env.SECRET_KEY)

  try {
    const user = await User.findOne({ email: session.email })

    const funds = await Fund.find(
      { userOwner: user._id },
      { fundToWithdraw: true }
    )
    const fundsId = funds.map(fund => fund._id)
    const withdraws = await Withdraw.find({
      fundToWithdraw: { $in: fundsId }
    })

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
  withdrawFund,
  withdrawFundIndex
}
