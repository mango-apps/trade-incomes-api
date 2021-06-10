const Withdraw = require('../../models/withdraw')
const Fund = require('../../models/fund')
const User = require('../../models/user')

const withdrawsIndex = async (req, res) => {
  const { status } = req.params

  try {
    let withdraws = await Withdraw.find()
    if (!withdraws.length) {
      return res.status(404).json({ error: 'Withdraws empty' })
    }

    withdraws = withdraws.filter(
      withdraw => withdraw.status === parseInt(status)
    )

    if (withdraws.length) {
      return res.json({ withdraws })
    } else {
      return res.json([])
    }
  } catch (error) {
    return res.status(404).json({ error: 'Withdraws Index error' })
  }
}

const withdrawsAccept = async (req, res) => {
  const { id } = req.body
  try {
    const withdrawDB = await Withdraw.findOne({ _id: id })

    if (!withdrawDB) return res.status(404).json({ error: 'Not withdraw' })

    const fundDB = await Fund.findOne({ _id: withdrawDB.fundToWithdraw })

    let finalGainedValue
    let finalInvested

    if (fundDB.gained < withdrawDB.amount) {
      finalGainedValue = 0
      finalInvested = fundDB.invested - withdrawDB.amount
    } else if (fundDB.gained > withdrawDB.amount) {
      finalGainedValue = fundDB.gained - withdrawDB.amount
      finalInvested = fundDB.invested
    } else {
      finalGainedValue = 0
      finalInvested = fundDB.invested
    }

    const fundPropertiesUpdated =
      Number(withdrawDB.amount) === Number(fundDB.gained + fundDB.invested)
        ? { status: 2 }
        : {
            status: 0,
            gained: finalGainedValue,
            invested: finalInvested
          }

    const fundUpdated = await Fund.findOneAndUpdate(
      { _id: fundDB._id },
      fundPropertiesUpdated
    )

    const withdrawUpdated = await Withdraw.findOneAndUpdate(
      { _id: withdrawDB._id },
      { status: 1 }
    )

    return res.json({ fundUpdated, withdrawUpdated })
  } catch (error) {
    return res.status(404).json({ error: 'Withdraw Accept error' })
  }
}

module.exports = {
  withdrawsIndex,
  withdrawsAccept
}
