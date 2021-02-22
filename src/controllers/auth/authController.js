const User = require('../../models/user')

const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const mailer = require('../../modules/mail')

const userRegister = async (req, res) => {
  const { name, email, password, cpf, phone } = req.body

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email is malformatted' })
    }

    const findedEmail = await User.findOne({ email }).lean()
    const findedCpf = await User.findOne({ cpf }).lean()

    if (findedEmail) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    if (findedCpf) {
      return res.status(400).json({ error: 'CPF already registered' })
    }

    const hashedPass = await bcrypt.hash(password, 8)

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      cpf,
      phone
    })

    return res.json({ name: user.name, email: user.email })
  } catch (error) {
    return res.status(400).json({ error: 'register failed' })
  }
}

const userLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email is malformatted' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(404).json({ error: `User not found` })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(406).json({ error: `Password don't match` })
    }

    const token = jwt.sign(
      { email, password, admin: user.admin },
      process.env.SECRET_KEY
    )

    return res.status(200).json({ token })
  } catch (error) {
    return res.status(400).json({ error: 'Login error' })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email is malformatted' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: `User not found` })
    }

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    const resetPass = {
      resetPassToken: token,
      resetPassExp: now
    }

    await User.findOneAndUpdate({ _id: user.id }, resetPass, {
      useFindAndModify: false
    })

    const mailOptions = {
      to: email,
      // EMAIL DO GABRIEL AQUI
      from: 'leandrovianacodes@gmail.com',
      // TODO: FAZER O TEMPLATE
      template: 'forgot',
      context: { token }
    }

    mailer.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res
          .status(400)
          .json({ error: `Cannot send forgot passoword to user's email` })
      }

      return res.status(200).json(info)
    })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email is malformatted' })
    }

    const user = await User.findOne({ email }).select(
      '+resetPassToken resetPassExp'
    )

    if (!user) {
      return res.status(404).json({ error: `User not found` })
    }

    if (token !== user.resetPassToken) {
      return res.status(404).json({ error: `Invalid token` })
    }

    const now = new Date()
    if (now > user.resetPassExp) {
      return res.status(404).json({ error: `Token expired` })
    }

    try {
      user.password = await bcrypt.hash(password, 8)
      await user.save()
    } catch (error) {
      return res.status(400).json({ error: 'register failed' })
    }
    return res.sendStatus(200)
  } catch (error) {
    return res.status(400).json({ error })
  }
}

module.exports = {
  userRegister,
  userLogin,
  forgotPassword,
  resetPassword
}
