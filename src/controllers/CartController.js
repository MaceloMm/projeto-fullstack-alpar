const { json } = require('express');
const prisma = require('../models/PrismaService');
const { use } = require('../app');


class CartController {

    static async list(req, res) {
        try{
        const user = req.user;
        const carts = await prisma.cart.findUnique({
            where: {userId: user.userId}
        });
        res.json(carts);
        }catch (err){
            res.status(400).json({'message': err})
        }
    }

    static async create(req, res) {
        const { products } = req.body;
        const user = req.user;
        console.log(user)
        const cart = await prisma.cart.create({
            data: {
                userId: user.userId,
                items: products ? [products] : [],
                Status: 'Pendente'
            }
        });
        res.json(cart);
    }

    static async putItem(req, res) {
        try {
            const { products } = req.body;
            const userId = req.user.userId;

            const cart = await prisma.cart.findUnique({
                where: { userId }
            });

            const currentItems = cart ? cart.items : [];
            const updatedItems = [...currentItems, ...products];

            await prisma.cart.upsert({
                where: { userId },
                update: { items: updatedItems },
                create: {
                    userId,
                    items: products,
                    Status: 'Pendente'
                }
            });

            res.json({ message: 'Produtos adicionados ao carrinho!' });

        } catch (error) {
            console.error('Erro ao atualizar carrinho:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }

    static async finallyCart(req, res) {
        try {
            const userId = req.user.userId;

            const currentCart = await prisma.cart.findFirst({
                where: { userId: userId }
            });

            const productIds = currentCart.items.map(item => item.productId);

            const products = await prisma.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, name: true, price: true }
            });

            const itemsWithPrices = currentCart.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    ...item,
                    name: product.name,
                    price: product.price
                }
            })

            const total = itemsWithPrices.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            await prisma.order.create({
                data: {
                    userId: currentCart.userId,
                    total: total,
                    items: itemsWithPrices,
                    cartId: currentCart.id
                }
            });

            await prisma.cart.update({
                where: {userId},
                data: {items: [], Status: "pendente"}
            });

            res.json({'message': true})
        } catch (error) {
            console.error('Erro ao atualizar o status: ', error)
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}
module.exports = CartController;
