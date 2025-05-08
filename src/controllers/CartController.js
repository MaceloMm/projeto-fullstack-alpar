const { json } = require('express');
const prisma = require('../models/PrismaService');
const { use } = require('../app');
const { compareSync } = require('bcrypt');


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

            const new_cart = await prisma.cart.upsert({
                where: { userId },
                update: { items: products },
                create: {
                    userId,
                    items: products,
                    Status: 'Pendente'
                }
            });

            res.json({new_cart});

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

            const total = currentCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

            await prisma.order.create({
                data: {
                    userId: currentCart.userId,
                    total: total,
                    items: currentCart.items,
                    cartId: currentCart.id
                }
            });

            await prisma.cart.update({
                where: {userId},
                data: {items: [], Status: "pendente"}
            });

            res.json({'message': 'Compra finalizada com sucesso!'})
        } catch (error) {
            console.error('Erro ao atualizar o status: ', error)
            res.status(500).json({ 'message': 'Erro interno no servidor' });
        }
    }
}
module.exports = CartController;
