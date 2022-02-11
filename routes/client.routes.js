const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const ClientController = require('../controllers/ClientController')

router.get('/', auth, ClientController.index)
router.post('/', auth, ClientController.create)
router.put('/:id',auth,ClientController.update)
router.put('/change_active/:id',auth,ClientController.change_active)

module.exports = router