const express = require('express');
const { addExpense, bulkUploadExpenses, getExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('multer')();

const router = express.Router();

router.post('/add', protect, addExpense);
router.post('/bulk', protect, upload.single('file'), bulkUploadExpenses);
router.get('/', protect, getExpenses);

module.exports = router;
