const User = require('../api/models/user.model')
const {hashData, verifyHashedData} = require('../api/util/hashdata');
const createToken = require('../api/util/createtoken');
const OTP = require('./otp/otp.model');
const generateOTP = require('./util/generateOTP.JS');
const sendEmail = require('./util/sendEmail');
const { default: mongoose } = require('mongoose');
const { EMAIL_AUTH } = process.env; 
const createNewuser = async(data)=>{
    try {
        const { name, email, password} = data;
        //checking if user already exist
        console.log(User);
        const existingUser = await User.findOne({ email });
        if(existingUser){
            throw Error("User already exists")
        }
        //hash password
        const hashedPassword = await hashData(password);
        const newUser = new User({
            _id:new mongoose.Types.ObjectId(),
            name,
            email,
            password:hashedPassword,
        })
        //save User
        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
        throw error;
    }
}
const authenticateUser = async (data) =>{
    try {
        const {email, password} = data;
        const fetchedUser = await User.findOne({email});
        if(!fetchedUser){
            throw Error("Invalid email entered");
        }
        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword)
        if(!passwordMatch){
            throw Error("Invalid password entered!")
        }
        if(!fetchedUser.verified){
            throw Error("Email hasn't been verified yet , check your inbox");
        }
        //create user token
        const tokenData = {userId: fetchedUser._id, email};
        const token = await createToken(tokenData);
        //assign user token
        fetchedUser.token = token;
        return fetchedUser;
    } catch (error) {
        throw error;
    }
}

//generate otp
const sendOTP = async ({ email, subject, message,
     duration = 1}) =>{
        try {
            if(!(email && subject && message)){
                throw Error("Provide values for email, subject, message");
            }

            //clear any old records
            await OTP.deleteOne( {email} );

            //generate OTP
            const generatedOTP = await generateOTP();

            //send email
            const mailOptions = {
                from: EMAIL_AUTH,
                to:email,
                subject:"this is for auth",
                text:'hello',
                html:` <p>${message}<br><b color:"red">${generatedOTP}</b></p><p>This <b>expires in ${duration} hour</b></p>`,
            };
            await sendEmail(mailOptions);
            
            //Save otp record
            const hashedOTP = await hashData(generatedOTP);
            const newOTP = await new OTP({
                email,
                otp: hashedOTP,
                createdAt : Date.now(),
                expiresAt: Date.now() + 3600000 * +duration,
            })
            const createdOTPRecord = await newOTP.save();
            return createdOTPRecord;

        } catch (error) {
            throw error;
        }
     }

//verification
const verifyOTP = async ({ email, otp}) =>{
    try {
        if(!(email && otp)){
            throw Error("Provide values for email ,otp");
        }

        //ensure otp record exists
        const matchedOTPRecord = await OTP.findOne({email});

        if(!matchedOTPRecord){
            throw Error("No otp records found");
        }

        //checking for expired code
        if(OTP.expiresAt < Date.now()){
            await OTP.deleteOne({email});
            throw Error("Code has expired . Request for a new one");
        }

        //not expired yet , verify value
        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp,hashedOTP);
        return validOTP;
    } catch (error) {
        throw Error(error);
    }
}
 const deleteOTP = async (email) =>{
    try {
        await OTP.deleteOne({email});
    } catch (error) {
        throw error;
    }
 }
 //sending email verification
 const sendVerificationOTPEmail = async (email) =>{
    try {
        //check if an account exist
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            throw Error("There is no acc for the provided email")
        }
        const OTPDetails = {
            email,
            subject:"Email Verification",
            message:"Verify your email with the code below",
            duration:1,
        }
        const createdOTP = await sendOTP(OTPDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
 }
 //verify user email
 const verifyUserEmail = async ({email, otp}) =>{
    try {
        const validOTP = await verifyOTP({email, otp});
        if(!validOTP) {
            throw Error("Invalid code passed. check your inbox")
        }
        //now update user record to show verified
        await User.updateOne({email}, {verified : true})

        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
 }

module.exports = {createNewuser, authenticateUser,
     sendOTP, verifyOTP, deleteOTP, 
     sendVerificationOTPEmail, verifyUserEmail}