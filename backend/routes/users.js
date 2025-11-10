const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, username, email, role, created_at FROM User ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user role (Admin only)
router.put('/:id/role', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await db.query(
            'UPDATE User SET role = ? WHERE user_id = ?',
            [role, req.params.id]
        );

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.user.userId === parseInt(req.params.id)) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await db.query('DELETE FROM User WHERE user_id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;