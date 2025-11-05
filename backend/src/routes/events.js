const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

router.use(auth);

// Create
router.post('/', async (req,res)=>{
  try {
    const { title, startTime, endTime } = req.body;
    const ev = await Event.create({ title, startTime, endTime, owner: req.user._id, status: 'BUSY' });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Read user's events
router.get('/me', async (req,res)=>{
  try {
    const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update (including status change)
router.patch('/:id', async (req,res)=>{
  try {
    const ev = await Event.findById(req.params.id);
    if(!ev) return res.status(404).json({ message: 'Event not found' });
    if(!ev.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
    const allowed = ['title','startTime','endTime','status'];
    allowed.forEach(k=>{ if(req.body[k] !== undefined) ev[k] = req.body[k]; });
    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete
router.delete('/:id', async (req,res)=>{
  try {
    const ev = await Event.findById(req.params.id);
    if(!ev) return res.status(404).json({ message: 'Event not found' });
    if(!ev.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
    await ev.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
