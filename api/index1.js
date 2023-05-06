const userroutes = require('./routes/user.route');
const taskroutes = require('./routes/task.route');
const prodRoutes = require('./routes/product.route');
const express = require('express');
const router = express.Router();

router.use('/user', userroutes);
router.use('/task',taskroutes);
router.use('/practice', prodRoutes);

module.exports = router;