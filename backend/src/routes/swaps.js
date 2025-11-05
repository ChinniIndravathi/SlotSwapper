const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/auth');

router.use(auth);

// GET swappable slots
router.get('/swappable-slots', async (req, res) => {
  const slots = await Event.find({
    status: 'SWAPPABLE',
    owner: { $ne: req.user._id }
  }).populate('owner', 'name');

  res.json(slots);
});

// CREATE swap request
router.post('/swap-request', async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot)
      return res.status(400).json({ message: 'Slot not found' });

    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE')
      return res.status(400).json({ message: 'Slots must be SWAPPABLE' });

    // Create swap request
    const request = await SwapRequest.create({
      mySlot: mySlotId,
      theirSlot: theirSlotId,
      requester: req.user._id,
      requestedTo: theirSlot.owner
    });

    // Lock slots
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';

    await mySlot.save();
    await theirSlot.save();

    res.json(request);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// RESPOND to swap
router.post('/swap-response/:id', async (req, res) => {
  try {
    const { accept } = req.body;

    const swap = await SwapRequest.findById(req.params.id)
      .populate('mySlot')
      .populate('theirSlot');

    if (!swap)
      return res.status(404).json({ message: 'Swap not found' });

    if (accept) {
      // ✅ swap owners
      const tempOwner = swap.mySlot.owner;
      swap.mySlot.owner = swap.theirSlot.owner;
      swap.theirSlot.owner = tempOwner;

      swap.mySlot.status = 'BUSY';
      swap.theirSlot.status = 'BUSY';

      await swap.mySlot.save();
      await swap.theirSlot.save();

      swap.status = 'ACCEPTED';
      await swap.save();

      return res.json(swap);
    }

    // ❌ rejected
    swap.mySlot.status = 'SWAPPABLE';
    swap.theirSlot.status = 'SWAPPABLE';

    await swap.mySlot.save();
    await swap.theirSlot.save();

    swap.status = 'REJECTED';
    await swap.save();

    return res.json(swap);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET incoming/outgoing requests
router.get('/requests', async (req, res) => {
  const incoming = await SwapRequest.find({ requestedTo: req.user._id })
    .populate('mySlot')
    .populate('theirSlot')
    .populate('requester', 'name');

  const outgoing = await SwapRequest.find({ requester: req.user._id })
    .populate('mySlot')
    .populate('theirSlot')
    .populate('requestedTo', 'name');

  res.json({ incoming, outgoing });
});

module.exports = router;
