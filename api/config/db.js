require("dotenv").config();
const mongoose = require('mongoose');

//url
//  console.log(dburl);

const connectToDB = async () =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/myuser',{})
    console.log("db connected");
    } catch (error) {
     console.log(error)   
    }
}

connectToDB();