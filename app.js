const express = require('express')
const { sequelize } = require('./models')
require('dotenv').config()
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())

// Api routes
const user_routes = require('./routes/user.routes')
const client_routes = require('./routes/client.routes')
const work_type_routes = require('./routes/workType.routes')
const work_list_routes = require('./routes/workList.routes')
const payment_routes = require('./routes/payment.routes')

app.use('/api/users', user_routes)
app.use('/ap/clients',client_routes)
app.use('/api/work_types',work_type_routes)
app.use('/api/work_types',work_list_routes)
app.use('/api/payments',payment_routes)

// ------------ end ---- Api routes -------

app.listen(process.env.NODE_PORT,process.env.NODE_IS_HOST, async () => {
    try {
        await sequelize.authenticate()
        console.log(`Server is running on ${process.env.NODE_IS_HOST}:${process.env.NODE_PORT} HOST`);
    } catch (error) {
        console.log('Error occured while syncing models with database', error)
    }
})