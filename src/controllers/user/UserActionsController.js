const User = require('../../models/user')
const Fund = require('../../models/fund')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const show = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY)

    const userFinded = await User.findOne({ email: user.email }).lean()

    if (!userFinded) {
      return res.status(404).json({ error: 'Got error at user load' })
    }

    return res.json({ data: userFinded })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const indexFunds = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const session = jwt.verify(token, process.env.SECRET_KEY)

  try {
    const user = await User.findOne({ email: session.email })

    const funds = await Fund.find({ userOwner: user._id })
      .where('status')
      .lte(1)

    if (funds.length) {
      return res.json({ funds })
    } else {
      return res.status(404).json({ error: 'No funds founded' })
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: `Cannot search for User's funds` })
  }
}

const changePassword = async (req, res) => {
  const { email, newPassword, oldPassword } = req.body

  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(404).json({ error: 'Got error at user load' })
    }

    const match = await bcrypt.compare(oldPassword, user.password)

    if (!match) {
      return res.status(406).json({ error: `Password don't match` })
    }

    const hashedPass = await bcrypt.hash(newPassword, 8)

    const update = { password: hashedPass }

    const result = await User.updateOne({ email }, update)

    if (result) {
      return res.json({ message: 'Password updated' })
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Cannot update the user password' })
  }
}

const editProfile = async (req, res) => {
  const { email, newEmail, name, phone, cpf } = req.body

  const token = req.headers.authorization.split(' ')[1]
  const userSession = jwt.verify(token, process.env.SECRET_KEY)

  if (email !== userSession.email) {
    return res.status(406).json({ error: 'Not authorized' })
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
      name: name || user.name,
      phone: phone || user.phone,
      cpf: cpf || user.cpf
    }

    const result = await User.updateOne({ _id: user.id }, userUpdates)

    if (result) {
      return res.json({ message: 'User updated successfully' })
    }
  } catch (error) {
    return res.status(400).json({ error: 'user cannot be updated' })
  }
}

module.exports = {
  show,
  changePassword,
  editProfile,
  indexFunds
}
