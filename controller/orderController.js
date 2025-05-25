const { StatusCodes } = require("http-status-codes");
// const connection = require("../mariadb");
const mariadb = require("mysql2/promise");
const connection = require("../mariadb");

const order = async (req, res) => {

    const connection = await mariadb.createConnection({
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "root",
            database: "Book",
            dateStrings: true
        });


    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

    let delivery_id;
    let order_id;

    // delivery 테이블 삽입
    let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
    let values = [delivery.address, delivery.receiver, delivery.contact];

    let [results] = await connection.execute(sql, values);

    delivery_id = result.insertId;

    // orders 테이블 삽입
    sql = "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)";
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await connection.execute(sql, values);
    order_id = result.insertId;

    // items를 가지고, 장바구니에서 book_id와 quantity를 가져온다.
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems, fields] = await connection.query(sql, [items]);

    // order_items 테이블 삽입
    sql = "INSERT INTO orderdBook (order_id, book_id, quantity) VALUES ?";
    values = [];
    orderItems.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    });
    results = await connection.query(sql, [values]);

    let result = await deleteCartItems(connection, items);
    return res.status(StatusCodes.OK).json(result);
}

const deleteCartItems = async (connection, items) => {
    let sql = "DELETE FROM cartItems WHERE id IN (?)";

    let result = await connection.query(sql, [items]);
    return result;
}

const getOrders = async (req, res) => {
    const connection = await mariadb.createConnection({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "root",
        database: "Book",
        dateStrings: true
    });

    let sql = `SELECT orders.id, created_at, address, receiver, cantact, book_title, total_quantity, total_price 
            FROM orders LEFT JOIN delivery
            ON orders.delivery_id = delivery.id`;
    let [rows, fields] = await connection.query(sql);

    return res.status(StatusCodes.OK).json(rows);
}

const getOrderDetail = async (req, res) => {
    const { order_id } = req.params;

    const connection = await mariadb.createConnection({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "root",
        database: "Book",
        dateStrings: true
    });

    let sql = `SELECT book_id, title, author, price, quantity
            FROM orderdBook LEFT JOIN books
            ON orderdBook.book_id = books.id
            WHERE order_id=?`;
    let [rows, fields] = await connection.query(sql, [order_id]);

    return res.status(StatusCodes.OK).json(rows);
}

module.exports = {
    order,
    getOrders,
    getOrderDetail
}
