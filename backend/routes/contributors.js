const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all contributors
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [contributors] = await db.query('SELECT * FROM Contributor ORDER BY name');
        res.json(contributors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single contributor
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [contributors] = await db.query(
            'SELECT * FROM Contributor WHERE contributor_id = ?',
            [req.params.id]
        );

        if (contributors.length === 0) {
            return res.status(404).json({ message: 'Contributor not found' });
        }

        res.json(contributors[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create contributor (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, contact_info, affiliation, expertise } = req.body;

        const [result] = await db.query(
            'INSERT INTO Contributor (name, contact_info, affiliation, expertise) VALUES (?, ?, ?, ?)',
            [name, contact_info, affiliation, expertise]
        );

        res.status(201).json({
            message: 'Contributor created successfully',
            contributorId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update contributor (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, contact_info, affiliation, expertise } = req.body;

        await db.query(
            'UPDATE Contributor SET name=?, contact_info=?, affiliation=?, expertise=? WHERE contributor_id=?',
            [name, contact_info, affiliation, expertise, req.params.id]
        );

        res.json({ message: 'Contributor updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete contributor (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM Contributor WHERE contributor_id = ?', [req.params.id]);
        res.json({ message: 'Contributor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;