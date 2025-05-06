const prisma = require('../models/PrismaService');
const bcrypt = require('bcrypt');

class SingUpUser {

    static async singUp(req, res) {
        const { username, email, password } = req.body;

        if (!username, !email, !password) {
            res.status(401).json({ 'message': 'Os campos precisam ser preenchidos' })
        }
        try {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: bcrypt.hashSync(password, 10)
                },
            });

            res.json({'message': `Usuario ${user.username} cadastrado com sucesso!`})
        }catch (error){
            console.log('Error: ' + error)
            res.status(500).json({'message': 'Erro interno no servidor!'});
        }
    }
}

module.exports = SingUpUser;