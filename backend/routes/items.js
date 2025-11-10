const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all items (with JOIN query)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM ItemsFullDetails ORDER BY item_id DESC');
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Search and filter items (Nested Query)
router.get('/search', authenticateToken, async (req, res) => {
    try {
        const { type, collection, contributor, search } = req.query;
        
        let query = `
            SELECT * FROM ItemsFullDetails
            WHERE 1=1
        `;
        const params = [];

        if (type) {
            query += ' AND type_name = ?';
            params.push(type);
        }
        if (collection) {
            query += ' AND collection_name = ?';
            params.push(collection);
        }
        if (contributor) {
            query += ' AND contributor_name LIKE ?';
            params.push(`%${contributor}%`);
        }
        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [items] = await db.query(query, params);
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single item details
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [items] = await db.query(
            'SELECT * FROM ItemsFullDetails WHERE item_id = ?',
            [req.params.id]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Log access using stored procedure
        await db.query(
            'CALL LogAccess(?, ?, ?, ?)',
            [req.params.id, req.user.userId, req.user.username, 'view']
        );

        res.json(items[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new item (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const {
            title, description, creation_date, acquisition_date,
            location, file_url, item_type_id, collection_id, contributor_id
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO ArchiveItem 
            (title, description, creation_date, acquisition_date, location, file_url, 
             item_type_id, collection_id, contributor_id, added_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, creation_date, acquisition_date, location, file_url,
             item_type_id, collection_id, contributor_id, req.user.userId]
        );

        res.status(201).json({
            message: 'Item created successfully',
            itemId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update item (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const {
            title, description, creation_date, acquisition_date,
            location, file_url, item_type_id, collection_id, contributor_id
        } = req.body;

        await db.query(
            `UPDATE ArchiveItem SET 
            title=?, description=?, creation_date=?, acquisition_date=?,
            location=?, file_url=?, item_type_id=?, collection_id=?, contributor_id=?
            WHERE item_id=?`,
            [title, description, creation_date, acquisition_date, location, file_url,
             item_type_id, collection_id, contributor_id, req.params.id]
        );

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete item (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM ArchiveItem WHERE item_id = ?', [req.params.id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get collections
router.get('/meta/collections', authenticateToken, async (req, res) => {
    try {
        const [collections] = await db.query('SELECT * FROM Collection');
        res.json(collections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get item types
router.get('/meta/types', authenticateToken, async (req, res) => {
    try {
        const [types] = await db.query('SELECT * FROM ItemType');
        res.json(types);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;