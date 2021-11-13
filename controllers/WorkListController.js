const { WorkList,Client,WorkType,User } = require('../models')
const joi = require('joi')
const access = require('../middleware/rbac')
const check_rule = access.check_rule
const PG = require('../services/paginate')

module.exports.index = async (req,res) => {
    if(!(await check_rule('work_list_show',req.user.user_id))){
        res.status(403).send({message: "Ruxsat yo'q"})
    }

    try {
        const workList = await WorkList.FindAll({
            attributes: {
                exclude: []
            },
            inclide: [
                {
                    model: Client,
                    as: 'client',
                    required: true,
                    attributes: ['id','title']
                },
                {
                    model: WorkType,
                    as: 'work_type',
                    required: true,
                    attributes: ['id', 'title']
                },
                {
                    model: User,
                    as: 'user',
                    required: true,
                    attributes: ['id','full_name']
                }
            ]
        })
        req.data = workList
        res.status(200).send(PG.paginate(req))
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

module.exports.create = async (req, res) => {
    try {
        if (!(await check_rule('work_types_add', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const validator = workListValidator(req.body)
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            res.status(400).send(message)
        }
        const work_type = await WorkList.create(req.body)
        res.status(201).send({
            message: "Yaratildi",
            object: work_type
        })
    } catch (error) {
        res.status(409).json(error.message)
    }
}

workListValidator = (fields) => {
    const validatorSchema = joi.object({
        title: joi.required(),
        value: joi.required(),
        client_id: joi.required(),
        work_type_id: joi.required(),
        user_id: joi.required(),
    })
    return validatorSchema.validate(fields);
}

module.exports.update = async (req, res) => {
    try {
        if (!(await access.check_rule('users_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const work_list = await WorkList.findByPk(req.params.id)
        await work_list.update(req.body)
        res.send({
            work_list,
            message: "Ma'lumotlari yangilandi"
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}