const express = require('express');
const List = require('../models/List');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 

const router = express.Router();
const JWT_SECRET = 'mynameissubhadipdutta';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Ensure this matches how you send the token
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ensure this contains the user information
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Apply middleware to all routes in this file
router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { name, responseCodes, images } = req.body;
    const createdAt = new Date().toISOString(); 
  
    try {
      const list = new List({
        user: req.user.userId, // Ensure req.user is defined
        name,
        responseCodes,
        images,
        createdAt // Ensure this is included
      });
  
      await list.save();
      res.status(201).json(list);
    } catch (error) {
      console.error('Error creating list:', error); 
      res.status(400).json({ error: 'Failed to create list' });
    }
  });

router.get('/', async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.userId });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
});

// Delete List
router.delete('/:id', async (req, res) => {
  try {
    const listId = req.params.id;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ error: 'Invalid list ID' });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (list.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Use findByIdAndDelete or deleteOne instead of remove
    await List.findByIdAndDelete(listId);

    res.status(200).json({ message: 'List deleted' });
  } catch (error) {
    console.error('Failed to delete list:', error); // Improved error logging
    res.status(500).json({ error: 'Failed to delete list' });
  }
});

// Update List
router.put('/:id', async (req, res) => {
  const { name, responseCodes, images } = req.body;
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    if (list.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Access denied' });

    list.name = name || list.name;
    list.responseCodes = responseCodes || list.responseCodes;
    list.images = images || list.images;
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update list' });
  }
});

module.exports = router;
