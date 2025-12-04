const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', rewardController.getRewards);

module.exports = router;
