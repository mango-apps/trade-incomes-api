const { Router } = require('express')
const authController = require('../controllers/auth/authController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.post(
  '/register',
  authMiddleware.verifyAdmin,
  authController.userRegister
)

router.post('/login', authController.userLogin)
router.post('/reset-password', authController.resetPassword)
router.post('/forgot-password', authController.forgotPassword)

module.exports = router
