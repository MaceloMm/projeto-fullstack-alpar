const prisma = require('../models/PrismaService');
const bcrypt = require('bcrypt');

class SingUpUser{

    static async singUp(req, res){
        const {username, email ,password} = req.body;
        
    }
}