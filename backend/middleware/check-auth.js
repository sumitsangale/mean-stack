const jwt = require('jsonwebtoken');

module.exports = (req, resp, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, "secrete_this_string_should_be_longer");
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch(error){
        resp.status(401).json({message: "auth failed!"})
    }
}