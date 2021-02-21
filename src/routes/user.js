const { Router } = require('express')
const userController = require('../controllers/user/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.get('/incomes', authMiddleware.verifyUser, userController.show)

module.exports = router
