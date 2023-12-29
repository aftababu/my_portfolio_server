const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Mongodb connected with server: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectDatabase;
