const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports.token = async (req, res) => {
  const { username, password, client_secret } = req.body
  try {
    const user = await User.findOne({ where: { username } })
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual || process.env.NODE_CLIENT_SECRET != client_secret) throw new Error("Passwords didn't match")
      const token = jwt.sign(
        {
          username,
          user_id: user.id
        },
        client_secret,
        { expiresIn: '12h' }
      )
      res.send({
        access_token: token,
        refresh_token: ''
      })
  } catch (error) {
    return res.status(400).json(error)
  }
}

