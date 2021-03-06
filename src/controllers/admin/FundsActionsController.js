const Fund = require('../../models/fund')
const User = require('../../models/user')

const ObjectId = require('mongoose').Types.ObjectId
const { default: validator } = require('validator')

const insertFund = async (req, res) => {
  const { email, invested, gained } = req.body

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email address is malformatted' })
  }

  try {
    const user = await User.findOne({ email }).lean()

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const fund = await Fund.create({
      invested,
      gained,
      userOwner: user._id
    })

    return res.json({ fund })
  } catch (error) {
    return res.status(400).json({ error: 'Cannot insert funds' })
  }
}

const patchFund = async (req, res) => {
  const { id, invested, gained } = req.body

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ObjectID malformatted' })
    }

    const fund = await Fund.findById(id).lean()

    if (!fund) {
      return res.status(404).json({ error: 'Fund not found' })
    }

    const result = await Fund.updateOne({ _id: id }, { invested, gained })

    if (result) {
      return res.json({ message: 'Fund updated successfully' })
    }
  } catch (error) {
    return res.status(400).json({ error: 'Cannot update funds' })
  }
}

module.exports = {
  insertFund,
  patchFund
}
