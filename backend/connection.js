const mongoose = require("mongoose")

const connectDB = async (Url) => {
    try {
        await mongoose.connect(Url)
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB