const prisma = require('../models/PrismaService');
class ProductController {
    static async list(req, res) {
        const products = await prisma.product.findMany();
        res.json(products);
    }
    static async create(req, res) {
        const { name, price, description } = req.body;
        const product = await prisma.product.create({
            data: { name, price: parseFloat(price), description }
        });
        res.json(product);
    }
}
module.exports = ProductController;
