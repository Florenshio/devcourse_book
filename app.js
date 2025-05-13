const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
})

// 라우터
const booksRouter = require("./route/books");
const usersRouter = require("./route/users");
const cartsRouter = require("./route/carts");
const ordersRouter = require("./route/orders");
const likesRouter = require("./route/likes");

// 미들웨어
app.use(express.json());

// 라우팅
app.use("/books", booksRouter);
app.use("/users", usersRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/likes", likesRouter);
