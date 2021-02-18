const { default: validator } = require('validator')
const User = require('../models/user')

const bcrypt = require('bcrypt')

const userPatch = async (req, res) => {
  const { email, newEmail, name, password } = req.body

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email is malformatted' })
  }

  if (newEmail && !validator.isEmail(newEmail)) {
    return res.status(400).json({ error: 'NewEmail is malformatted' })
  }

  const userFindedWithNewEmail = await User.findOne({
    email: newEmail
  }).lean()

  if (newEmail && userFindedWithNewEmail) {
    return res.status(404).json({
      error: `new email is not valid because you already registered`
    })
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(404).json({ error: `User not found` })
  }

  try {
<<<<<<< HEAD
=======

>>>>>>> ee868ce16c6955f965100e5896eea7b425bd4a66
    const bcryptResult = password && (await bcrypt.hash(password, 8))

    const userUpdates = {
      email: newEmail || email,
      name: name || user.name,
      password: bcryptResult || user.password
    }

    const userPatch = await User.findOneAndUpdate(
      { _id: user.id },
      userUpdates,
      { useFindAndModify: false }
    )

    return res.json(userPatch)
  } catch (error) {
    return res.status(400).json({ error: 'user cannot be updated' })
  }
}

const userDelete = async (req, res) => {
  const { email } = req.body

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email is malformatted' })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ error: `User not found` })
  }

  try {
    await User.findOneAndDelete(
      { _id: user.id },
      { useFindAndModify: false }
    )

    return res.json({ message: 'User deleted' })
  } catch (error) {
    return res.status(400).json({ error: 'User cannot is deleted' })
  }
}

const userIndex = async (_req, res) => {
  const users = await User.find({ admin: false })

  if (!users) {
    return res.status(404).json({ message: 'Users not found' })
  }

  return res.json({ users })
}

const incomesPut = async (req, res) => {
  const { email, amountInvested, earnedValue } = req.body

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email is malformatted' })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ error: `User not found` })
  }

  try {
    const incomesUpdated = {
      incomes: {
        amountInvested,
        earnedValue
      }
    }

    await User.findOneAndUpdate({ _id: user.id }, incomesUpdated, {
      useFindAndModify: false
    })

    return res.json({ message: 'User incomes updated' })
  } catch (error) {
    return res.status(400).json({ error: 'Cannot input incomes' })
  }
}

module.exports = {
  userPatch,
  userDelete,
  userIndex,
  incomesPut
}
