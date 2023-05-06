const express = require('express');
const product = require('../models/productSchema')
const router = express.Router();

router.post('/product',async (req,res)=>{
    const {name , price, category} = req.body;
    const newpro = new product({
        name:req.body.name,
        price:req.body.price,
        category:req.body.category
    })
    const createdPrd = await newpro.save();
     res.status(200).json(createdPrd);
})

module.exports = router;