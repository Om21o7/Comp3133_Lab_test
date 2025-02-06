const express = require('express');
const GroupMessage = require('../models/GroupMessage');
const router = express.Router();

router.get('/group/:room', async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
