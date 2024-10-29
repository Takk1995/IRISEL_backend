const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// 獲取特定商品資料
router.get('/product/:code', async (req, res) => {
    const productCode = req.params.code;
    console.log('正在獲取 product_code:', productCode);

    try {
        const [productResults] = await pool.query('SELECT * FROM products WHERE product_code = ?', [productCode]);

        if (productResults.length === 0) {
            return res.status(404).json({ message: '商品未找到' });
        }

        console.log('獲取到的商品資料:', productResults);
        res.json(productResults);
    } catch (err) {
        console.log('無法獲取特定商品資料');
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
        console.log('無法隨機獲取多款商品資料');
        return res.status(500).json({ error: err.sqlMessage });
    }
});

module.exports = router;
