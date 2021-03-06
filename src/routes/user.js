const { Router } = require('express')
const userController = require('../controllers/user/UserActionsController')
const authMiddleware = require('../middlewares/authMiddleware')
const WithdrawActionsController = require('../controllers/user/WhitdrawalActionsController')

const router = Router()

router.get(
  '/withdraw',
  authMiddleware.verifyUser,
  WithdrawActionsController.withdrawFund
)

router.get('/profile', authMiddleware.verifyUser, userController.show)

router.put(
  '/change-password',
  authMiddleware.verifyUser,
  userController.changePassword
)

router.patch(
  '/profile',
  authMiddleware.verifyUser,
  userController.editProfile
)

router.get('/funds', authMiddleware.verifyUser, userController.indexFunds)

module.exports = router
