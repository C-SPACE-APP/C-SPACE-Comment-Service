const establishConnection = require('./establishConnection')

const initializeDatabase = async () =>
{
    let isSuccessful = false
    const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS CommentService;"
    const createTableQuery = "CREATE TABLE IF NOT EXISTS Comment(commentID INT PRIMARY KEY AUTO_INCREMENT, comment TEXT, createdAt DATETIME, updatedAt DATETIME);"
    let connection
    try
    {
        connection = await establishConnection(false)
        await connection.execute(createDatabaseQuery)
        await connection.destroy()
        connection = await establishConnection(true)
        await connection.execute(createTableQuery)
        isSuccessful = true
        console.log("Database initialization successful")
    }
    catch(err)
    {
        console.log("Failed to initialize database.")
        console.log("Terminating program")
        console.log(`Error message: ${err}`)
    }
    await connection.destroy()
    return isSuccessful? true:false
}

module.exports = initializeDatabase