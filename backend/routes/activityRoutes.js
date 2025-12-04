const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authenticateToken = require('../middlewares/authMiddleware');

// Check if authMiddleware exists, if not we might need to create it or import it correctly.
// Based on file list, 'middlewares' dir exists. I'll assume it's there or I'll check it.
// Actually, I should verify the middleware name.
// Let's assume standard naming for now, but I'll check the directory in a moment if needed.
// For now, I'll assume the user has a middleware for auth. 
// Wait, the user said "i have already made the authetication".
// I'll check the middlewares directory content in the next step to be sure, but for writing this file I'll assume a standard import.
// If it fails, I'll fix it.

router.use(authenticateToken);

router.get('/', activityController.getActivities);
router.post('/', activityController.addActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
