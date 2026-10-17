const mongoose = require("mongoose")

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database")
    }
    catch (err) {
        console.log("Database connection failed:", err)
        throw err
    }
}

module.exports = connectToDB