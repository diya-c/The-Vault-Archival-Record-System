const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all access logs (Admin only) - with JOIN
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT 
                a.access_id,
                a.access_date,
                a.access_type,
                a.accessor_name,
                a.ip_address,
                ai.item_id,
                ai.title as item_title,
                u.username,
                u.email
            FROM Access a
            LEFT JOIN ArchiveItem ai ON a.item_id = ai.item_id
            LEFT JOIN User u ON a.user_id = u.user_id
            ORDER BY a.access_date DESC
            LIMIT 100
        `);
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get access logs for specific item (Nested Query)
router.get('/item/:itemId', authenticateToken, async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT 
                a.access_id,
                a.access_date,
                a.access_type,
                a.accessor_name,
                u.username,
                u.email
            FROM Access a
            LEFT JOIN User u ON a.user_id = u.user_id
            WHERE a.item_id = ?
            ORDER BY a.access_date DESC
        `, [req.params.itemId]);
        
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get access statistics (Aggregate Query)
router.get('/statistics', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [stats] = await db.query('SELECT * FROM AccessStatistics ORDER BY total_accesses DESC');
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Log download access
router.post('/log-download', authenticateToken, async (req, res) => {
    try {
        const { itemId } = req.body;

        await db.query(
            'CALL LogAccess(?, ?, ?, ?)',
            [itemId, req.user.userId, req.user.username, 'download']
        );

        res.json({ message: 'Download logged successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;