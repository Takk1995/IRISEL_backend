var express = require("express");
var cors = require("cors");
var app = express();
app.listen(8000); // 端口號可以根據需要更改
app.use( express.static("public")  );
app.use( express.json() );

// 若有表單需要提交，則需要添加這行程式碼來解析表單資料
// app.use( express.urlencoded( {extended: true}) );

// 設定 CORS 以允許前端請求
app.use(cors());

// 建立 MySQL 連接
var mysql = require("mysql2/promise");
var conn;

async function initializeDatabase() {
    try {
        conn = await mysql.createConnection({
            user: "root",
            password: "",
            host: "localhost",
            port: 3306,
            database: "irisel"
        });
        console.log('百變怪:資料庫連線正常');
    } catch (err) {
        console.log('百變怪:資料庫連線異常');
        console.log('---------------分隔線----------------');
        console.log(err);
        console.log('百變怪:' + err.sqlMessage);
        console.log('---------------分隔線----------------');
    }
}

// 初始化資料庫連接
initializeDatabase();

// 建立 API 端點以獲取特定 product_id 的商品資料
app.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id; // 獲取 URL 中的 product_id
    console.log('正在獲取 product_id:', productId); // 打印正在獲取的 product_id

    try {
        // 查詢商品資料
        const [productResults] = await conn.query('SELECT * FROM generalproducts WHERE product_id = ?', [productId]);
        
        // 查詢價格資料
        const [priceResults] = await conn.query('SELECT price FROM stock_management WHERE product_id = ?', [productId]);

        // 如果查詢結果為空，回傳 404
        if (productResults.length === 0 || priceResults.length === 0) {
            return res.status(404).json({ message: '商品未找到' });
        }
        
        // 組合商品資料與價格
        const productData = {
            ...productResults[0],
            price: priceResults[0].price // 假設 price 返回的是一個包含價格的物件
        };

        console.log('獲取到的商品資料:', productData); // 打印查詢結果
        res.json(productData); // 返回合併的查詢結果
    } catch (err) {
        console.log('百變怪:無法獲取特定商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});