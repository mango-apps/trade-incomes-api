const Fund = require('../../models/fund')
const Withdraw = require('../../models/withdraw')

const ObjectId = require('mongoose').Types.ObjectId

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

    const resultFundUpdate = Fund.findOneAndUpdate(
      { _id: id },
      { status: 1 },
      {
        useFindAndModify: false
      }
    )

    if (!resultFundUpdate)
      return res.status(400).json({ error: 'Cannot update status fund' })

    const withdraw = await Withdraw.create({
      Withdraw: value,
      fundToWithdrawal: fund._id
    })

    return res.json({ withdraw })
  } catch (error) {
    return res.status(400).json({ error: 'Cannot withdraw funds' })
  }
}

module.exports = {
  withdrawFund
}
