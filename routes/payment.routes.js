const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const PaymentController = require('../controllers/PaymentController')

router.get('/', auth, PaymentController.index)
router.post('/', auth, PaymentController.create)
router.put('/:id',auth,PaymentController.update)

module.exports = router