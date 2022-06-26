const startBackend = require('./utils/backendStarter')
const initializeDatabase = require('./utils/initializeDatabase')


const port = process.env.PORT || 3006


if(initializeDatabase())
    startBackend(port)

