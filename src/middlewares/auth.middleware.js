const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.ACCESS_KEY;


function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization; 
    if (!authHeader){
        return res.status(401).json({ message: 'Token não enviado' });
    };
    try {
        const decoded = jwt.verify(authHeader, SECRET_KEY);
        req.user = decoded; // userId, username
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}
module.exports = verificarToken;