const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');

// Verify token endpoint
router.get('/verify', checkJwt, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: 'Token is valid'
  });
});

module.exports = router;