const express = require('express');
const router = express.Router();
// const User = require('../models/user.model');
const Task = require('../models/task.model');
// const mongoose = require('mongoose');
const auth = require('../middleware/auth');
// const User = require('../models/user.model');
//protected route
// router.get("/", auth, (req, res)=>{
//     console.log(req.currentUser);
//     res.status(200)
//     .send(`You are In Task ${req.currentUser.userId}`);
// })
router.post('/createTask', auth, async (req, res) => {
    const { taskname } = req;
    const { currentUser } = req;
    const len = await Task.find({ userid: currentUser.userId }).count();
    console.log(len);
    // console.log(id);
    const newTask = new Task({
        //    _id: new mongoose.Types.ObjectId(),
        userid: currentUser.userId,
        taskname: req.body.taskname,
        taskdate: Date.now(),
        priority: (len + 1),
    })
    const createdTask = await newTask.save();
    res.status(200).json(createdTask);
    // res.status(200).json("hello");
})

// API Endpoint: Rearrange Tasks
router.post('/rearrange_tasks',auth, async (req, res) => {
    try {
        const { src, des } = req;
        const { currentUser } = req;
        const uid = currentUser.userId;
        const source = req.body.src;//2
        const dest = req.body.des; //4
        
        if (dest < source) {// src =4 , des =2
            var sourcedata = source + 0.5; //4 - 0.5 = 4.5
            await Task.findOneAndUpdate({userid:uid,priority:source},{priority:sourcedata});
            
            await Task.updateMany({userid:uid,$and:[{ priority: { $gte: dest  } }, { priority: { $lt: source } }]},
                                     {$inc:{priority: 1}}, {multi:true});  
                
            await Task.updateOne({userid:uid, priority: sourcedata }, { $set: { priority: dest } });
        }
        if (dest > source) {//  src = 2 , des = 4
            var sourcedata = source - 0.5; //2- 0.5 = 1.5
            await Task.findOneAndUpdate({userid:uid,priority:source},{priority:sourcedata});
            
            await Task.updateMany({userid:uid, $and:[{ priority: { $gt: source } }, { priority: { $lte: dest } }]},
                                     {$inc:{priority: -1}}, {multi:true});  
                
             await Task.updateOne({userid:uid, priority: sourcedata }, { $set: { priority: dest } });
        }
        const updatedTasks = await Task.find({}).sort('priority');

        res.status(200).json({
            message: 'Tasks rearranged successfully',
            tasks: updatedTasks
        });
    } catch (err) {
        console.error('Failed to rearrange tasks:', err);
        res.status(500).json({ message: 'Failed to rearrange tasks' });
    }
});


router.post('/reorder', auth, async (req, res, next) => {
    try {
        const { src, des } = req;
        const task = await Task.find({});
        for (var i = 0; i < task.length; i++) {
            const ele = await Task.find({ task: task[i]._id });
            const newp = ele.priority;
            console.log(newp);
            Task.findOne({ priority: newp }, (err, doc) => {
                doc
            })
            // console.log(ele);
        }
        res.status(200).json("sowhay");
    }
    catch (error) {
        console.log(error.message);
    }
})
//get all task
router.get('/getalltask', auth, async (req, res, next) => {
    const Tasks = await Task.find({}).populate('userid').sort('priority');
    res.status(200).json(Tasks);

})



//updating a task
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const option = { new: true };
        const result = await Task.findByIdAndUpdate(id, updates, option);
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
    // res.send("updating a single product");
});




//delete a paricular task
router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Task.findByIdAndDelete({ _id: id });
        res.status(200).json('successfully deleted')
    } catch (error) {
        res.send(error.message);
    }
    // res.send("deleting a single product")
});

// reordering task





// for(var i=0; i<dataarray.length; i++){
//  var results = await Task.findOneAndUpdate({taskname : `${dataarray[i]}`});
// }
// console.log(results);
// let results = await Task.find({userid:"modricosta@gmail.com"});


// console.log(results);
// let update = {taskname:dataarray[i]}
// const item = dataarray[i];
// const option = {new:true};
//    let result = await Task.updateMany({taskname:results},{$set:{taskname:}})


//  console.log(result);
//get reorder
router.get('/reorder', auth, async (req, res, next) => {
    try {

        // console.log(userid);
        const results = await Task.find({ userid: `${userid}` });

        // console.log(arr.taskname);
        res.send(results);
    }
    catch (error) {
        console.log(error.message);
    }
})
module.exports = router;