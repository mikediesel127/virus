// routes/top8Routes.js
const express = require('express');
const router = express.Router();
const Top8 = require('../models/Top8');

// POST endpoint to create a new Top 8 list
router.post('/', async (req, res) => {
  try {
    const { user, category, items } = req.body;
    const newTop8 = new Top8({ user, category, items });
    await newTop8.save();
    res.status(201).json(newTop8);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET endpoint to retrieve a user's Top 8 lists
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const top8Lists = await Top8.find({ user: userId });
    res.status(200).json(top8Lists);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// PUT endpoint to update a Top 8 list
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;
    const updatedTop8 = await Top8.findByIdAndUpdate(id, { items }, { new: true });
    res.status(200).json(updatedTop8);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE endpoint to delete a Top 8 list
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Top8.findByIdAndDelete(id);
    res.status(200).json({ message: 'Top 8 list deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
