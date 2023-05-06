const jwt = require('jsonwebtoken');

const { TOKEN_KEY , TOKEN_EXPIRY} = process.env;

const createToken = async (
    tokenData,
    tokenKey = `${process.env.TOKEN_KEY}`,
    expiresIn
) =>{
    try {
        // console.log(expiresIn);
        const token = await jwt.sign(tokenData,
             tokenKey,{
                expiresIn:"24h",
            })
            console.log(token)
            return token;
    } catch (error) {
        throw error;
    }
}

module.exports = createToken;