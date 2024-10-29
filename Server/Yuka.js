var express = require("express");
var cors = require("cors");
var app = express();
app.listen(8000); // 端口號可以根據需要更改
app.use(express.static("public"));
app.use(express.json());

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

// 建立 API 端點以獲取特定 product_code 的商品資料
app.get('/api/product/:code', async (req, res) => {
    const productCode = req.params.code; // 獲取 URL 中的 product_code
    console.log('正在獲取 product_code:', productCode); // 打印正在獲取的 product_code

    try {
        // 查詢商品資料
        const [productResults] = await conn.query('SELECT * FROM products WHERE product_code = ?', [productCode]);

        // 如果查詢結果為空，回傳 404
        if (productResults.length === 0) {
            return res.status(404).json({ message: '商品未找到' });
        }

        console.log('獲取到的商品資料:', productResults); // 打印查詢結果
        res.json(productResults); // 返回合併的查詢結果
    } catch (err) {
        console.log('百變怪:無法獲取特定商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});

// 隨機抓取多款不同商品的資料
app.get('/api/random-recommend-products', async (req, res) => {
    try {
        const numberOfRecommendations = 12; // 可以根據需求調整要推薦的商品數量

        // 生成隨機的 product_id (從 1 到 150)
        const randomProductIds = new Set();
        while (randomProductIds.size < numberOfRecommendations) {
            const randomId = Math.floor(Math.random() * 150) + 1; // 隨機生成 1~150 的數字
            randomProductIds.add(Math.floor((randomId - 1) / 3) * 3 + 1); // 確保每次取到的是同一款商品的第一個 ID
        }

        // 將隨機選出的 id 轉成陣列，以便用於 SQL 查詢
        const productIdArray = Array.from(randomProductIds);

        // 查詢這些 product_id 對應的商品資料（這裡我們只取每一款的第一筆資料）
        const [productResults] = await conn.query(
            'SELECT * FROM products WHERE product_id IN (?)',
            [productIdArray]
        );

        // 回傳查詢結果
        res.json(productResults);
    } catch (err) {
        console.log('百變怪:無法隨機獲取多款商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});

// 用於獲取商品目錄的路由
app.get('/api/catalog', async (req, res) => {
    const mainTypeId = req.query.main_type_id; // 獲取查詢參數中的 main_type_id
    console.log('獲取 main_type_id:', mainTypeId); // 打印正在獲取的 main_type_id

    try {
        // 查詢商品資料
        const [productResults] = await conn.query('SELECT * FROM products WHERE main_type_id = ?', [mainTypeId]);

        // 如果查詢結果為空，回傳 404
        if (productResults.length === 0) {
            return res.status(404).json({ message: '未找到相關商品' });
        }

        console.log('獲取到的商品資料:', productResults); // 打印查詢結果
        res.json(productResults); // 返回合併的查詢結果
    } catch (err) {
        console.log('百變怪:無法獲取商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});