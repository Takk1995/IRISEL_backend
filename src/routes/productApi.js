const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// 獲取特定商品資料
router.get('/product/:code', async (req, res) => {
    const productCode = req.params.code;
    // console.log('正在獲取 product_code:', productCode);

    try {
        const [productResults] = await pool.query('SELECT * FROM products WHERE product_code = ?', [productCode]);

        if (productResults.length === 0) {
            return res.status(404).json({ message: '商品未找到' });
        }

        // console.log('獲取到的商品資料:', productResults);
        res.json(productResults);
    } catch (err) {
        // console.log('無法獲取特定商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});

// 隨機抓取多款不同商品的資料
router.get('/random-recommend-products', async (req, res) => {
    try {
        const numberOfRecommendations = 12;
        const randomProductIds = new Set();
        while (randomProductIds.size < numberOfRecommendations) {
            const randomId = Math.floor(Math.random() * 150) + 1;
            randomProductIds.add(Math.floor((randomId - 1) / 3) * 3 + 1);
        }

        const productIdArray = Array.from(randomProductIds);
        const [productResults] = await pool.query('SELECT * FROM products WHERE product_id IN (?)', [productIdArray]);

        res.json(productResults);
    } catch (err) {
        // console.log('無法隨機獲取多款商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});

// 用於獲取商品目錄的路由
router.get('/catalog', async (req, res) => {
    const mainTypeId = req.query.main_type_id; // 獲取查詢參數中的 main_type_id
    // console.log('獲取 main_type_id:', mainTypeId); // 打印正在獲取的 main_type_id

    try {
        // 查詢商品資料
        const [productResults] = await pool.query('SELECT * FROM products WHERE main_type_id = ?', [mainTypeId]);

        // 如果查詢結果為空，回傳 404
        if (productResults.length === 0) {
            return res.status(404).json({ message: '未找到相關商品' });
        }

        // console.log('獲取到的商品資料:', productResults); // 打印查詢結果
        res.json(productResults); // 返回合併的查詢結果
    } catch (err) {
        // console.log('百變怪:無法獲取商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});

module.exports = router;
