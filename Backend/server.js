require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")


async function startServer() {
    try {
        await connectToDB()

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.log("Failed to start server:", err)
    }
}

startServer()