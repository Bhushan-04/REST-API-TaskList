const express = require('express');
const router = express.Router();

const { createNewuser,authenticateUser, sendOTP,
     verifyOTP, sendVerificationOTPEmail, verifyUserEmail } = require('../controller');
// const auth = require('../middleware/auth');
// //protected route
// router.get("/task", auth, (req, res)=>{
//     res.status(200)
//     .send(`You are In Task ${req.currentUser.email}`);
// })
 
//Register
router.post('/register', async(req, res) =>{
    try {
        let { name, email, password} = req.body;

        if(!(name && email && password)){
            throw Error("Empty input fields");
        }
        else if(!/^[a-zA-Z ]*$/.test(name)){
            throw Error("Invalid name");
        }
        else if( !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
                throw Error("Invalid email entered")
        }
        else if(password.length < 8){
            throw Error("password should be greater than 8 character")
        }
        else{
           //create new user if cred is good
           const newUser = await createNewuser({name,
             email, password});
            await sendVerificationOTPEmail(email);
           res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})
//login
router.post("/",async (req, res)=>{
    try {
        let { email, password } = req.body;
        if(!(email && password)){
            throw Error("Empty Cred supplied")
        }
        const authenticatedUser = await authenticateUser({ email, password });
        res.status(200).json(authenticatedUser);
    
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//otp
router.post('/otp', async (req, res)=>{
    try {
        const { email, subject, message, duration} = req.body;
        const createdOTP = await sendOTP({
            email,
            subject,
            message,
            duration
        });  
        res.status(200).json(createdOTP);    
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//verify opt
router.post('/verify', async (req, res)=>{
    try {
        let { email, otp } = req.body;
        const validOTP = await verifyOTP({email, otp});
        res.status(200).json({ valid: validOTP});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//request new verification otp
router.post('/emailverification',async (req, res) =>{
    try {
        const {email} = req.body;
        if(!email){
            throw Error("An email is required");
        }
        const createdEmailVerificatonOTP = await 
        sendVerificationOTPEmail(email);
        res.status(200).json(createdEmailVerificatonOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//request new verification otp
router.post('/emailverification/verify', async (req, res)=>{
    try {
        let {email, otp} = req.body;
        if(!(email && otp)){
            throw Error("Empty otp details are not allowed");
        }
        await verifyUserEmail({email,otp});
        res.status(200).json({email, verified: true })
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;