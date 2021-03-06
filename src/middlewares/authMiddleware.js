const jwt = require('jsonwebtoken')
const User = require('../models/user')

const verifyAdmin = (req, res, next) => {
  verifyUserIsAdminOrNot(req, res, next, true)
}

const verifyUser = (req, res, next) => {
  verifyUserIsAdminOrNot(req, res, next)
}

const verifyUserIsAdminOrNot = async (req, res, next, admin = false) => {
  const token = req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'not authorized' })
  }

  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY)

    let searchOption = {
      email: user.email
    }

    if (admin) searchOption = { ...searchOption, admin }

    const isAuthorized = await User.findOne(searchOption).lean()

    if (!isAuthorized) {
      return res.status(403).json({ error: 'not authorized' })
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'invalid jwt' })
  }
}

module.exports = {
  verifyAdmin,
  verifyUser
}
