const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const WorkTypesController = require('../controllers/WorkTypesController')

router.get('/', auth, WorkTypesController.index)
router.post('/', auth, WorkTypesController.create)
router.put('/:id',auth,WorkTypesController.update)
router.put('/change_active/:id',auth,WorkTypesController.change_active)

module.exports = router