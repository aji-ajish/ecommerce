const app = require('./app')
const connectDatabase = require('./config/database')
const path = require('path')

connectDatabase()

const server=app.listen(process.env.PORT, () => {
    console.log(`server listening to the port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

process.on('unhandledRejection', (err) => {
    console.log("error " + err.message);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1)
    })
})


process.on('uncaughtException', (err) => {
    console.log("error " + err.message);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(()=>{
        process.exit(1)
    })
})
