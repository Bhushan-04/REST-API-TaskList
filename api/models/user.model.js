const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserScehma = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    password:String,
    token:String,
    verified: {type: Boolean, default: false}
})

const User = mongoose.model("userregister", UserScehma);

module.exports = User;