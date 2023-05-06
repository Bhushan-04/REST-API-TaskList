const jwt = require('jsonwebtoken');
require("dotenv").config();
const { TOKEN_KEY } = process.env;

const verifyToken = async(req, res, next)=>{
    const token = req.body.token || req.query.token 
    || req.headers["x-access-token"] || req.headers.authorization;
    //console.log(token);
    //check for provided token
    if(!token){
        console.log();
        return res.status(403).send("An auth token is required");
    }

    //verify token
    try {

        const decodedToken = jwt.verify(token,
            `${process.env.TOKEN_KEY}`);
            req.currentUser = decodedToken;
            console.log(decodedToken);
             
    } catch (error) {
        return res.status(401).send("Invalid Token")
    }
    //proceed with req
    return next();
}

module.exports = verifyToken;