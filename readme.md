# Loja Virtual - Full Stack

## Equipe

- Integrante 1: Macelo Augusto lopes de Matos
- Integrante 2: Luan Pereira dos Santos
- Integrante 3: Vinicius Zeferino Ribeiro

---

## Descrição do Projeto

Este é um projeto de loja virtual Full Stack desenvolvido com:

- **Frontend:** AngularJS  
- **Backend:** Node.js + Express  
- **Banco de Dados:** SQLite + Prisma ORM  
- **Upload de Imagens:** Multer  
- **Testes de API:** Postman  

---

## Funcionalidades

- Cadastro e login de usuários  
- Cadastro de produtos  
- Carrinho de compras dinâmico  
- Checkout  
- Área de contato  
- Banner rotativo  
- Menu dinamico

---

## Tecnologias Utilizadas

- AngularJS (v1.8.2)  
- HTML5 + CSS3  
- Node.js  
- Express  
- SQLite  
- Prisma ORM  
- Multer (para upload de imagens)  
- Postman (para testar rotas da API)  

---

## Configurações do Projeto

Para rodar o projeto localmente, siga os passos abaixo:

1. Clone o repositório para sua máquina local.  
2. Navegue até a pasta raiz do projeto com `cd projeto-fullstack-alpar`.  
3. Instale as dependências do projeto com os comandos:  

   ```bash
   npm install  
   npm install bcrypt express jsonwebtoken multer prisma sqlite3
   ```

4. Instale o `nodemon` como dependência de desenvolvimento com `npm install -D nodemon`.  
5. Inicialize o Prisma com `npx prisma init`.  
6. Execute a primeira migração para criar as tabelas no banco com `npx prisma migrate dev --name init`.  
7. Crie e configure o arquivo `.env` na raiz do projeto com o seguinte conteúdo:  

   ```
   DATABASE_URL="file:./dev.db"
   ACCESS_KEY="b1c58e772dc841fe8986f27a23743d28"
   ```

8. Popule o banco de dados com dados iniciais usando `npx prisma db seed`.  
9. Inicie o servidor local com `npm run dev`.  
10. (Opcional) Se quiser visualizar e gerenciar o banco de dados via interface gráfica, use o comando `npx prisma studio`.
