const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/login', async(req, res) => {
    const {username, password} = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ message: '帳號錯誤'});
        }

        const user = rows[0];
        
        if (password !== user.password) {
            return res.status(400).json({ message: '密碼錯誤'});
        }

        res.json({message: '登入成功', user: {id: user.id, username: user.username}});
    } catch (error) {        
        res.status(400).json({ message: '連線錯誤'})
    }
})

router.get('/admin', async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM adminproducts');
        res.json(rows);
    } catch (error) {
        res.status(401).json({ message: '連線錯誤'})
    }
})

router.post('/admin', async(req, res) => {
    const newProduct = req.body;
    try {
        const [result] = await pool.query('INSERT INTO adminproducts SET ?', [newProduct]);
        res.status(200).json({id: result.insertId, ...newProduct});
    } catch (error) {
        res.status(400).json({ message: '新增失敗'});
    }
})

router.put('/admin/:id', async(req, res) => {
    const {id} = req.params;
    const updateProduct = req.body;
    try {
        await pool.query('UPDATE adminproducts SET ? WHERE id = ?', [updateProduct, id]);
        res.json({ message: '更新成功'});
    } catch (error) {
        res.status(400).json({ message: '更新失敗'});
    }
})

router.delete('/admin/:id', async(req, res) => {
    const {id} = req.params;
    try {
        await pool.query('DELETE FROM adminproducts WHERE id = ?', [id]);
        res.json({ message: '刪除成功'});
    } catch (error) {
        res.status(400).json({ message: '刪除失敗'});
    }
})

module.exports = router;