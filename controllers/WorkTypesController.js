const { WorkType } = require('../models')
const joi = require('joi')
const { Op, INTEGER } = require('sequelize')
const access = require('../middleware/rbac')
const check_rule = access.check_rule
const PG = require('../services/paginate')
const url = require('url')

module.exports.index = async (req, res) => {
    if(!(await check_rule('work_types_show',req.user.user_id))){
        res.status(403).send({ message: 'Ruxsat yo\'q' })
    }
    try {
        const workTypes = await WorkType.findAll({
            attributes: {
                exclude: []
            },
            where: {
                title: {
                  [Op.like]: `%${url.parse(req.url,true).query.search}%`
                }
              },
              order: [
                ['id', 'DESC'],
            ],
        });
        req.data = workTypes
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
        const validator = workTypeValidator(req.body)
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            res.status(400).send(message)
        }
        const work_type = await WorkType.create(req.body)
        work_type.active = 1
        res.status(201).send({
            message: "Yaratildi",
            object: work_type
        })
    } catch (error) {
        res.status(409).json(error.message)
    }
}

workTypeValidator = (fields) => {
    const validatorSchema = joi.object({
        title: joi.required(),
        value: joi.required(),
    })
    return validatorSchema.validate(fields);
}

module.exports.update = async (req, res) => {
    try {
        if (!(await check_rule('work_types_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const work_type = await WorkType.findByPk(req.params.id)
        if(work_type.title != req.body.title){
            delete req.body,title
        }
        await work_type.update(req.body)
        res.send({
            object: work_type,
            message: "Ma'lumotlari yangilandi"
        })
    } catch (error) {
        res.send(error)
    }
}

module.exports.change_active = async (req, res) => {
    try {
        if (!(await check_rule('work_types_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const work_type = await WorkType.findByPk(req.params.id)
        const status = work_type.active ? 'Nofaollashtirildi' : 'Faollashtirildi'
        await work_type.update({
            active: !work_type.active
        })
        res.send({
            object: work_type,
            message: `${status}`
        })
    } catch (error) {
        res.send(error)
    }
}