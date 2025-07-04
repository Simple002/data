const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connect(process.env.DATABASE)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      process.exit(1); // Завершить процесс при ошибке
    });
};

module.exports = connectDB;