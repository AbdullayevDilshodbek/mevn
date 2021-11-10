const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const UserController = require('../controllers/UserController')
const TokenGenerate = require('../services/tokenGenerate')

router.get('/', auth,UserController.index)
router.post('/',auth,UserController.create)
router.put('/:id',auth,UserController.update)
router.put('/change_active/:id',auth,UserController.change_active)
router.post('/token',TokenGenerate.token)
router.get('/get_auth_user',auth,UserController.get_active_user)

module.exports = router