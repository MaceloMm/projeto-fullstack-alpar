const prisma = require('../models/PrismaService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const SECRET_KEY = process.env.SECRET_KEY;

class AuthController {
    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Username e senha são obrigatórios' });
        }

        try {
            // Busca usuário no banco
            const user = await prisma.user.findUnique({
                where: { email }
            });

            // Verifica se usuário existe e compara senha com bcrypt
            if (!user || !bcrypt.compareSync(password, user.password)) {
                console.log(bcrypt.hashSync('macelo123', 10))
                console.log(bcrypt.compareSync('macelo123', user.password))
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Gera token JWT
            const token = jwt.sign(
                { userId: user.id, username: user.username },
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