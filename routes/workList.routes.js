const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const WorkListController = require('../controllers/WorkListController')

router.get('/', auth, WorkListController.index)
router.post('/', auth, WorkListController.create)
router.put('/:id',auth,WorkListController.update)

module.exports = router