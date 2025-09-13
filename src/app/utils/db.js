const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/farmerInfo"
mongoose.connect(url);
const db = mongoose.connection;
db.on('connected',()=>{
    console.log('Connected to mongoDB');
})
db.on('disconnected',()=>{
    console.log('Disconnected from mongoDB');
})
module.exports = db;