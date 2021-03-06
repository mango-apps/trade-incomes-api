const express = require('express')
const { json, urlencoded } = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const app = express()
const api = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

const authRoutes = require('./routes/auth')
const managerRoutes = require('./routes/manager')
const userRoutes = require('./routes/user')

app.use('/auth', authRoutes)
app.use('/manager', managerRoutes)
app.use('/user', userRoutes)

api.use('/api', app)

const server = api.listen(3000, () => {
  const { address, port } = server.address()

  console.log(`Server listening at http://${address}:${port}`)
})
