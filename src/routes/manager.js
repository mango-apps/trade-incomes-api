const { Router } = require('express')

const authMiddleware = require('../middlewares/authMiddleware')
const UserActionsController = require('../controllers/admin/UserActionsController')
const FundsActionsController = require('../controllers/admin/FundsActionsController')
const router = Router()

router.delete(
  '/user',
  authMiddleware.verifyAdmin,
  UserActionsController.userDelete
)

router.patch(
  '/user',
  authMiddleware.verifyAdmin,
  UserActionsController.userPatch
)

router.get(
  '/user',
  authMiddleware.verifyAdmin,
  UserActionsController.userIndex
)

router.post(
  '/funds',
  authMiddleware.verifyAdmin,
  FundsActionsController.insertFund
)

router.patch(
  '/funds',
  authMiddleware.verifyAdmin,
  FundsActionsController.patchFund
)

module.exports = router
