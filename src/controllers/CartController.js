const prisma = require('../models/PrismaService');
class CartController {
    static async list(req, res) {
        const carts = await prisma.cartItem.findMany();
        res.json(carts);
    }
    static async create(req, res) {
        const { productid, quantity } = req.body;
        const cart = await prisma.cartItem.create({
            data: { productId, quantity }
        });
        res.json(cart);
    }
}
module.exports = CartController;
