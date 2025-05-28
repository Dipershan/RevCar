const express = require('express');
const router = express.Router();

const { authenticateUser, requireAdmin } = require('../middlewares/authenticateUser');

router.get('/', authenticateUser, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;
