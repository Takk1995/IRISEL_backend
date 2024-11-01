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

router.post('/orders', async(req, res) => {
    const {guestUser, guestCart, productPackage, ship, total} = req.body
    
    if (!guestUser || !guestCart || !productPackage || !ship || !total) {
        return res.status(400).json({ error: 'error'})
    }

    const guestId = guestUser.guest_id
    const guestEmail = guestUser.guest_email
    const productDetails = guestCart.map(item => ({
        product_id: item.product_id,
        cart_qty: item.cart_qty
    }))

    const createdAt = new Date().toISOString()

    const insertOrderQuery = `
        INSERT INTO orders (guest_id, guest_email, total, product_details, ship, package, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    try {
        const [result] = await pool.query(insertOrderQuery, [
            guestId,
            guestEmail,
            total,
            JSON.stringify(productDetails),
            JSON.stringify(ship),
            productPackage,
            createdAt
        ])
        
        const order_id = result.insertId

        res.status(200).json({order_id})
    } catch (error) {
        res.status(400).json({error: 'error'})
    }
})

module.exports = router;