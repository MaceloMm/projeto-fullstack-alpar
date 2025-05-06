const prisma = require('../models/PrismaService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const SECRET_KEY = process.env.ACCESS_KEY;

class AuthController {
    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Username e senha são obrigatórios' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user || !bcrypt.compareSync(password, user.password)) {
                console.log(bcrypt.hashSync('macelo123', 10))
                console.log(bcrypt.compareSync('macelo123', user.password))
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username, email: user.email },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.json({ token });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ message: 'Erro interno no servidor' });
        }
    }
}

module.exports = AuthController;