const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../models/database');
const { authenticateToken, isModerator } = require('../middleware/auth');

const router = express.Router();

// Create a new post (reply to a topic)
router.post('/',
  authenticateToken,
  [
    body('topic_id').isInt(),
    body('content').isLength({ min: 1 }).trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic_id, content } = req.body;
    const user_id = req.user.id;

    // Check if topic exists and is not locked
    db.get('SELECT * FROM topics WHERE id = ?', [topic_id], (err, topic) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!topic) {
        return res.status(400).json({ error: 'Topic not found' });
      }
      if (topic.is_locked && req.user.role !== 'moderator' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Topic is locked' });
      }

      // Create post
      db.run(
        'INSERT INTO posts (topic_id, user_id, content) VALUES (?, ?, ?)',
        [topic_id, user_id, content],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create post' });
          }

          // Update topic's updated_at timestamp
          db.run('UPDATE topics SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [topic_id]);

          res.status(201).json({
            message: 'Post created successfully',
            postId: this.lastID
          });
        }
      );
    });
  }
);

// Update a post (only by owner or moderator)
router.put('/:id',
  authenticateToken,
  [
    body('content').isLength({ min: 1 }).trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;

    // Check if post exists and user is owner or moderator
    db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const isMod = req.user.role === 'moderator' || req.user.role === 'admin';
      if (post.user_id !== req.user.id && !isMod) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      db.run(
        'UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update post' });
          }
          res.json({ message: 'Post updated' });
        }
      );
    });
  }
);

// Delete a post (only by owner or moderator)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isMod = req.user.role === 'moderator' || req.user.role === 'admin';
    if (post.user_id !== req.user.id && !isMod) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Don't allow deleting the first post (would orphan the topic)
    if (post.is_first_post) {
      return res.status(400).json({ error: 'Cannot delete the first post. Delete the topic instead.' });
    }

    db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete post' });
      }
      res.json({ message: 'Post deleted' });
    });
  });
});

module.exports = router;
