const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskScehma = new Schema({
    taskname:String,
    taskdate:Date,
    taskstatus:{type:Boolean , default:false},
    userid:{type:mongoose.Schema.Types.ObjectId, ref: "userregister"},
    priority:Number
})

const Task = mongoose.model("task",taskScehma);

module.exports = Task;