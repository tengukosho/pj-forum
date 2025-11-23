const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../models/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  db.all(
    `SELECT c.*, 
     COUNT(DISTINCT t.id) as topic_count,
     COUNT(DISTINCT p.id) as post_count
     FROM categories c
     LEFT JOIN topics t ON c.id = t.category_id
     LEFT JOIN posts p ON t.id = p.topic_id
     GROUP BY c.id
     ORDER BY c.display_order, c.id`,
    (err, categories) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(categories);
    }
  );
});

// Get a single category with its topics
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM categories WHERE id = ?', [id], (err, category) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get topics in this category
    db.all(
      `SELECT t.*, u.username,
       COUNT(p.id) as reply_count,
       MAX(p.created_at) as last_post_at
       FROM topics t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN posts p ON t.id = p.topic_id
       WHERE t.category_id = ?
       GROUP BY t.id
       ORDER BY t.is_pinned DESC, t.updated_at DESC`,
      [id],
      (err, topics) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ ...category, topics });
      }
    );
  });
});

// Create a new category (Admin only)
router.post('/',
  authenticateToken,
  isAdmin,
  [
    body('name').isLength({ min: 1 }).trim().escape(),
    body('description').optional().trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, display_order } = req.body;

    db.run(
      'INSERT INTO categories (name, description, display_order) VALUES (?, ?, ?)',
      [name, description, display_order || 0],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Category already exists' });
          }
          return res.status(500).json({ error: 'Failed to create category' });
        }
        res.status(201).json({ message: 'Category created', categoryId: this.lastID });
      }
    );
  }
);

// Update a category (Admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  [
    body('name').optional().isLength({ min: 1 }).trim().escape(),
    body('description').optional().trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, display_order } = req.body;

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    db.run(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values,
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update category' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category updated' });
      }
    );
  }
);

// Delete a category (Admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete category' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  });
});

module.exports = router;
