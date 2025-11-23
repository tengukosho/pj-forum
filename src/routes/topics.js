const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../models/database');
const { authenticateToken, isModerator } = require('../middleware/auth');

const router = express.Router();

// Get all topics (with pagination)
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  db.all(
    `SELECT t.*, u.username, c.name as category_name,
     COUNT(p.id) as reply_count
     FROM topics t
     JOIN users u ON t.user_id = u.id
     JOIN categories c ON t.category_id = c.id
     LEFT JOIN posts p ON t.id = p.topic_id
     GROUP BY t.id
     ORDER BY t.is_pinned DESC, t.updated_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, topics) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      db.get('SELECT COUNT(*) as total FROM topics', (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({
          topics,
          pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
          }
        });
      });
    }
  );
});

// Get a single topic with its posts
router.get('/:id', (req, res) => {
  const { id } = req.params;

  // Increment view count
  db.run('UPDATE topics SET view_count = view_count + 1 WHERE id = ?', [id]);

  db.get(
    `SELECT t.*, u.username, c.name as category_name, c.id as category_id
     FROM topics t
     JOIN users u ON t.user_id = u.id
     JOIN categories c ON t.category_id = c.id
     WHERE t.id = ?`,
    [id],
    (err, topic) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      // Get posts for this topic
      db.all(
        `SELECT p.*, u.username, u.role
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.topic_id = ?
         ORDER BY p.created_at ASC`,
        [id],
        (err, posts) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ ...topic, posts });
        }
      );
    }
  );
});

// Create a new topic with first post
router.post('/',
  authenticateToken,
  [
    body('title').isLength({ min: 5, max: 200 }).trim(),
    body('content').isLength({ min: 10 }).trim(),
    body('category_id').isInt()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category_id } = req.body;
    const user_id = req.user.id;

    // Check if category exists
    db.get('SELECT id FROM categories WHERE id = ?', [category_id], (err, category) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }

      // Create topic
      db.run(
        'INSERT INTO topics (title, category_id, user_id) VALUES (?, ?, ?)',
        [title, category_id, user_id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create topic' });
          }

          const topicId = this.lastID;

          // Create first post
          db.run(
            'INSERT INTO posts (topic_id, user_id, content, is_first_post) VALUES (?, ?, ?, 1)',
            [topicId, user_id, content],
            function(err) {
              if (err) {
                // Rollback topic creation
                db.run('DELETE FROM topics WHERE id = ?', [topicId]);
                return res.status(500).json({ error: 'Failed to create post' });
              }
              res.status(201).json({
                message: 'Topic created successfully',
                topicId,
                postId: this.lastID
              });
            }
          );
        }
      );
    });
  }
);

// Update a topic (only by owner or moderator)
router.put('/:id',
  authenticateToken,
  [
    body('title').optional().isLength({ min: 5, max: 200 }).trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title } = req.body;

    // Check if topic exists and user is owner or moderator
    db.get('SELECT * FROM topics WHERE id = ?', [id], (err, topic) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      const isMod = req.user.role === 'moderator' || req.user.role === 'admin';
      if (topic.user_id !== req.user.id && !isMod) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      db.run(
        'UPDATE topics SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update topic' });
          }
          res.json({ message: 'Topic updated' });
        }
      );
    });
  }
);

// Pin/Unpin a topic (Moderator only)
router.patch('/:id/pin', authenticateToken, isModerator, (req, res) => {
  const { id } = req.params;
  const { is_pinned } = req.body;

  db.run(
    'UPDATE topics SET is_pinned = ? WHERE id = ?',
    [is_pinned ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update topic' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      res.json({ message: `Topic ${is_pinned ? 'pinned' : 'unpinned'}` });
    }
  );
});

// Lock/Unlock a topic (Moderator only)
router.patch('/:id/lock', authenticateToken, isModerator, (req, res) => {
  const { id } = req.params;
  const { is_locked } = req.body;

  db.run(
    'UPDATE topics SET is_locked = ? WHERE id = ?',
    [is_locked ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update topic' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      res.json({ message: `Topic ${is_locked ? 'locked' : 'unlocked'}` });
    }
  );
});

// Delete a topic (only by owner or moderator)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM topics WHERE id = ?', [id], (err, topic) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const isMod = req.user.role === 'moderator' || req.user.role === 'admin';
    if (topic.user_id !== req.user.id && !isMod) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    db.run('DELETE FROM topics WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete topic' });
      }
      res.json({ message: 'Topic deleted' });
    });
  });
});

module.exports = router;
