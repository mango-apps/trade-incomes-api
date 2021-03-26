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
      const withdrawsWithUserInfo = await Promise.all(
        withdraws.map(async doc => {
          const user = await User.findOne({ _id: doc.userOwner })
          return {
            ...doc._doc,
            user: { name: user.name, phone: user.phone, cpf: user.cpf }
          }
        })
      )
      return res.json({ withdraws: withdrawsWithUserInfo })
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
    const fundPropertiesUpdated =
      withdrawDB.Withdraw == fundDB.gained
        ? { status: 2 }
        : {
            status: 0,
            gained: fundDB.gained - withdrawDB.Withdraw
          }

    const fundUpdated = await Fund.updateOne(
      { _id: fundDB._id },
      fundPropertiesUpdated
    )

    const withdrawUpdated = await Withdraw.updateOne(
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
