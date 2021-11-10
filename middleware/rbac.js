/**
 * Qanday foydalaniladi ?
 * "check_rule" module 2 ta argument larni talab qiladi.
 *     1) Rule code
 *     2) Amalyot bajarayotgan foydalanuvchi(profil egasi) id si 
 * Argumentlar to'liq berilgan holda foydalanuvchi shu action ni 
 * bajara olishga huquqi bor yoki yo'q (true or false) ni qaytaradi
 */
const { User, Rule } = require('../models')
module.exports.check_rule = (code, user_id) => {
    try {
        const user = User.findByPk(user_id,{
            where: {active: true},
            include: [
                {
                    model: Rule,
                    as: 'rules',
                    required: true,
                    attributes: ['title'],
                    where: {code},
                }
            ]
        })
        return user;
    } catch (error) {
        return error.message
    }
}