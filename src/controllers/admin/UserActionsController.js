const validator = require('validator')
const User = require('../../models/user')

const userPatch = async (req, res) => {
  const { email, newEmail, name } = req.body

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email address is malformatted' })
  }

  if (newEmail && !validator.isEmail(newEmail)) {
    return res
      .status(400)
      .json({ error: 'New email address is malformatted' })
  }

  const userFindedWithNewEmail = await User.findOne({
    email: newEmail
  }).lean()

  if (newEmail && userFindedWithNewEmail) {
    return res.status(404).json({
      error: `new email is not valid because it's already registered`
    })
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(404).json({ error: `User not found` })
  }

  try {
    const userUpdates = {
      email: newEmail || email,
      name: name || user.name
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

module.exports = {
  userPatch,
  userDelete,
  userIndex
}
