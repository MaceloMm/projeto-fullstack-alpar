const prisma = require('../models/PrismaService');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.ACCESS_KEY;
class AuthController {
    static async login(req, res) {
        const { username, password } = req.body;
        const user = await prisma.user.findFirst({
            where: { username, password }
        });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ token });
    }
}
module.exports = AuthController;