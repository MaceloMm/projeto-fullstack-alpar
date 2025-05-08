const prisma = require('../models/PrismaService');
const bcrypt = require('bcrypt');

class SingUpUser {

    static async singUp(req, res) {
        const { username, email, password } = req.body;

        if (!username, !email, !password) {
            return res.status(401).json({ 'message': 'Os campos precisam ser preenchidos' })
        }

        try {

            const exists_email = await prisma.user.findUnique({
                where: { email: email }
            })
    
            if (exists_email){
                return res.status(400).json({ 'message': 'Email já cadastrado!' })
            }

            const user = await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: bcrypt.hashSync(password, 10)
                },
            });

            await prisma.cart.create({
                data: {
                    userId: user.id,
                    items: [],
                    Status: 'Pendente'
                }
            });

            return res.json({'message': `Usuario ${user.username} cadastrado com sucesso!`})
        }catch (error){
            console.log('Error: ' + error)
            return res.status(500).json({'message': 'Erro interno no servidor!'});
        }
    }
}

module.exports = SingUpUser;