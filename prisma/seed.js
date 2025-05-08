// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'cliente1@example.com',
        username: 'cliente1',
        password: await bcrypt.hash('senha123', 10),
      },
      {
        email: 'cliente2@example.com',
        username: 'cliente2',
        password: await bcrypt.hash('senha456', 10),
      },
      {
        email: 'cliente3@example.com',
        username: 'cliente3',
        password: await bcrypt.hash('senha789', 10),
      }
    ],
  });

  const [user1, user2, user3] = await prisma.user.findMany();

  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Memoria Ram DDR5',
        price: 400.00,
        description: 'Memoria ram para computadores',
        image: 'images/prodImages/memoriaram.png'
      },
      {
        name: 'Processador Ryzen 5 8400F',
        price: 1000.00,
        description: 'Processador para computadores',
        image: 'images/prodImages/processadorryzen.png'
      },
      {
        name: 'PlayStation 5',
        price: 2500.00,
        description: 'Video game para jogar jogos legais!',
        image: 'images/prodImages/play5.png'
      },
    ],
  });

  const [memoria, processador, play5] = await prisma.product.findMany();

  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.id,
      items: JSON.stringify([]), // Carrinho vazio
      Status: 'pendente'
    }
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.id,
      items: JSON.stringify([]), // Carrinho vazio
      Status: 'pendente'
    }
  });

  const cart3 = await prisma.cart.create({
    data: {
      userId: user3.id,
      items: JSON.stringify([]), // Carrinho vazio
      Status: 'pendente'
    }
  });

  console.log('Seed concluído com sucesso!');
  console.log({
    users: await prisma.user.findMany(),
    products: await prisma.product.findMany(),
    carts: await prisma.cart.findMany(),
    orders: await prisma.order.findMany()
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });