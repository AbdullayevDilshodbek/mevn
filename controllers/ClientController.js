const { Client } = require('../models')
const Joi = require('joi');
const access = require('../middleware/rbac')
const check_rule = access.check_rule
const PG = require('../services/paginate')
require('dotenv').config()

module.exports.index = async (req, res) => {
    if (!(await check_rule('clients_show', req.user.user_id))) {
        res.status(403).send({ message: 'Ruxsat yo\'q' })
    }
    try {
        const clients = await Client.findAll({
            attributes: {
                exclude: []
            },
            order: [
                ['id', 'DESC'],
            ],
        });
        req.data = clients.map(el => {
            if(el.type == "self"){
                el.type = "Ichki"
            } else {
                el.type = "Tashqi"
            }
            return el
        })
        res.status(200).send(PG.paginate(req))
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports.create = async (req, res) => {
    try {
        if (!(await check_rule('clients_add', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const validator = clientValidator(req.body)
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            res.status(400).send(message)
        }
        const client = await Client.create(req.body)
        client.active = 1
        client.type = client.type == 'self' ? 'Ichki' : 'Tashqi'
        res.status(201).send({
            message: "Yaratildi",
            object: client
        })
    } catch (error) {
        res.status(409).json(error.message)
    }
}

clientValidator = (fields) => {
    const validatorSchema = Joi.object({
        full_name: Joi.string().required(),
        type: Joi.string().required(),
    })
    return validatorSchema.validate(fields);
}

module.exports.update = async (req, res) => {
    try {
        if (!(await check_rule('clients_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const client = await Client.findByPk(req.params.id)
        if(client.full_name == req.body.full_name){
            delete req.body.full_name
        }
        await client.update({
            full_name: req.body.full_name,
            type: req.body.type
        })
        res.send({
            object: client,
            message: "Ma'lumotlari yangilandi"
        })
    } catch (error) {
        res.send(error)
    }
}

module.exports.change_active = async (req, res) => {
    try {
        if (!(await check_rule('clients_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const client = await Client.findByPk(req.params.id)
        const status = client.active ? 'Nofaollashtirildi' : 'Faollashtirildi'
        await client.update({
            active: !client.active
        })
        res.send({
            object: client,
            message: `${status}`
        })
    } catch (error) {
        res.send(error)
    }
}