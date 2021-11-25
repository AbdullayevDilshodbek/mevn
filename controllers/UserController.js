const { User, Rule } = require('../models')
const Joi = require('joi');
const { Op, INTEGER } = require('sequelize')
const _ = require('lodash')
const bcrypt = require("bcrypt");
const access = require('../middleware/rbac')
const check_rule = access.check_rule
const PG = require('../services/paginate')
const dotenv = require('dotenv').config()

module.exports.index = async (req, res) => {
    if (!(await check_rule('users_show', req.user.user_id))) {
        res.status(403).send({ message: 'Ruxsat yo\'q' })
    }
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['password']
            },
            order: [
                ['id', 'DESC'],
            ],
        });
        req.data = users
        res.status(200).send(PG.paginate(req))
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports.create = async (req, res) => {
    try {
        if (!(await access.check_rule('users_add', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const { full_name, username, password } = req.body
        const validator = userValidator(req.body)
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            res.status(400).send(message)
        }
        let hashPassword = await bcrypt.hash(password.toString(), await bcrypt.genSalt(10))
        const user = await User.create({
            full_name,
            username,
            password: hashPassword,
            active: true
        })
        res.status(201).send({
            message: "Foydalanuvchi yaratildi",
            object: user
        })
    } catch (error) {
        res.status(409).json({error})
    }
}

userValidator = (fields) => {
    const validatorSchema = Joi.object({
        full_name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.required(),
    })

    return validatorSchema.validate(fields);
}

module.exports.update = async (req, res) => {
    try {
        if (!(await access.check_rule('users_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const { username, password } = req.body
        let hashPassword = password ? await bcrypt.hash(password.toString(), await bcrypt.genSalt(10)) : null
        const user = await User.findByPk(req.params.id)
        if(username == user.username){
            delete req.body.username
        }
        if(password){
            req.body.password = hashPassword
        }
        await user.update(req.body)
        res.send({
            object: await User.findByPk(req.params.id),
            message: "Foydalanuvchi ma'lumotlari yangilandi"
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports.change_active = async (req, res) => {
    try {
        if (!(await access.check_rule('users_edit', req.user.user_id))) {
            res.status(403).send({ message: 'Ruxsat yo\'q' })
        }
        const user = await User.findByPk(req.params.id)
        const status = user.active ? 'nofaollashdi' : 'faollashdi'
        await user.update({
            active: !user.active
        })
        res.send({
            object: user,
            message: `Foydalanuvchi ${status}`
        })
    } catch (error) {
        res.send(error)
    }
}

// auth userni olish
module.exports.get_active_user = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id, {
            include: [
                {
                    model: Rule,
                    as: 'rules',
                    required: true,
                    attributes: ['id', 'title', 'code']
                }
            ]
        })
        res.send(_.pick(user, ['id', 'username', 'full_name', 'active', 'rules']))
    } catch (error) {
        res.send(error.message)
    }
}