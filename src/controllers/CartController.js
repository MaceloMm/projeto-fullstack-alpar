const prisma = require('../models/PrismaService');
const { use } = require('../routes/singup.routes');
class CartController {
    static async list(req, res) {
        const user = req.user;
        const carts = await prisma.cartItem.findMany({
            where: user.id
        });
        res.json(carts);
    }
    static async create(req, res) {
        const { productId, quantity } = req.body;
        const user = req.user;
        console.log(user)
        const cart = await prisma.cartItem.create({
            data: {
                userId: user.userId,
                productId: productId,
                quantity, quantity
            }
        });
        res.json(cart);
    }

    static async putItem(req, res){
        
    }
}
module.exports = CartController;
