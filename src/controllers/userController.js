const User = require('../models/user')
const jwt = require('jsonwebtoken')

const show = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]

  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY)

    const userFinded = await User.findOne({ email: user.email }).lean()

    if (!userFinded) {
      return res.status(404).json({ error: 'Got error at user load' })
    }

    return res.json({ userFinded })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

module.exports = {
  show
}
