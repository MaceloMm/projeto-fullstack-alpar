const prisma = require('../models/PrismaService');
class ProductController {

    static async list(req, res) {
        const products = await prisma.product.findMany();
        res.json(products);
    }

    static async create(req, res) {
        const { name, price, description } = req.body;
        const imgProd = req.file ? `images/prodImages/${req.file.filename}` : null
        const product = await prisma.product.create({
            data: { 
                name: name, 
                price: parseFloat(price), 
                description: description, 
                image: imgProd
            }
        });
        res.json(product);
    }

}
module.exports = ProductController;