const Expense = require('../models/expenseModel');
const csv = require('csv-parser');
const fs = require('fs');

const addExpense = async (req, res) => {
  const { description, amount, paymentMethod, category } = req.body;
  const expense = new Expense({ user: req.user._id, description, amount, paymentMethod, category });
  await expense.save();
  res.status(201).json(expense);
};

const bulkUploadExpenses = async (req, res) => {
  const expenses = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      expenses.push({ ...row, user: req.user._id });
    })
    .on('end', async () => {
      await Expense.insertMany(expenses);
      res.status(201).json({ message: 'Expenses added' });
    });
};

const getExpenses = async (req, res) => {
  const { category, startDate, endDate, paymentMethod } = req.query;
  const query = {
    user: req.user._id,
    ...(category && { category }),
    ...(paymentMethod && { paymentMethod }),
    ...(startDate && endDate && {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }),
  };

  const expenses = await Expense.find(query)
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(expenses);
};

module.exports = { addExpense, bulkUploadExpenses, getExpenses };
