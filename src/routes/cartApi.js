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

module.exports = router;