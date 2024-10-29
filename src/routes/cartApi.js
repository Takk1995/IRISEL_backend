const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/cartItem', async(req, res) => {
    const itemIds = req.body.itemIds
    
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({ error: 'ItemIDs error'})
    }

    const placeholders = itemIds.map(() => '?').join(',')    
    const getCartItemsData = `SELECT * FROM products WHERE product_id IN (${placeholders})`
    
    try {
        const [result] = await pool.query(getCartItemsData, itemIds)
        res.json(result)
    } catch (error) {
        res.status(400).json({ error: 'error'})
    }
})

router.get('/updateCapacity', async(req, res) => {
    const {product_code} = req.query
        
    if (!product_code) {
        return res.status(400).json({error: 'error'})
    }
    const numericProductCode = Number(product_code)
    console.log(numericProductCode);
    
    try {
        const [result] = await pool.query('SELECT * FROM products WHERE product_code = ?', [product_code])
        if (result.length === 0) {
            return res.status(400).json({error: 'error'})
        }
        console.log(result[0]);
        
        res.json(result[0])
    } catch (error) {
        res.status(400).json({error: 'error'})
    }
})

module.exports = router;