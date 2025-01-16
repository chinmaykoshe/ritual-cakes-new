const mongoose = require('mongoose');

const mongo_URL = process.env.MONGO_CONN;

mongoose.connect(mongo_URL)
    .then(()=> {
        console.log('MongoDB Connected ...');
    })
    .catch((err)=>{
        console.log('MongoDB Connection Error ...',err);
    })