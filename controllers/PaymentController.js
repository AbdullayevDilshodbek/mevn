const { Payment } = require('../models')
const joi = require('joi')
const access = require('../middleware/rbac')
const check_rule = access.check_rule
const PG = require('../services/paginate')

module.exports.index = async (req, res) => {
    if(!(await check_rule('work_types_show',req.user.user_id))){
        res.status(403).send({ message: 'Ruxsat yo\'q' })
    }
    try {
        const payment = await Payment.findAll({
            attributes: {
                exclude: []
            }
        });
        req.data = payment
        res.status(200).send(PG.paginate(req))
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports.create = async (req, res) => {
    try {
        if (!(await check_rule('work_types_add', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const validator = paymentValidator(req.body)
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            res.status(400).send(message)
        }
        const payment = await Payment.create(req.body)
        res.status(201).send({
            message: "Yaratildi",
            object: payment
        })
    } catch (error) {
        res.status(409).json(error.message)
    }
}

paymentValidator = (fields) => {
    const validatorSchema = joi.object({
        title: joi.required(),
        value: joi.required(),
        work_list_id: joi.required()
    })
    return validatorSchema.validate(fields);
}

module.exports.update = async (req, res) => {
    try {
        if (!(await check_rule('work_types_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const payment = await Payment.findByPk(req.params.id)
        await payment.update(req.body)
        res.send({
            payment,
            message: "Ma'lumotlari yangilandi"
        })
    } catch (error) {
        res.send(error)
    }
}