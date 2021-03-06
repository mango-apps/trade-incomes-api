const Withdraw = require('../../models/withdraw')

const withdrawsIndex = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().where('status').equals(0)
    if (!withdraws.length) {
      return res.status(404).json({ error: 'Withdraws empty' })
    }

    return res.json({ withdraws })
  } catch (error) {}
}

module.exports = {
  withdrawsIndex
}
