const express = require('express');
const { createSubscription } = require('./subscription.controller');

const router = express.Router();

router.post('/subscribe', createSubscription);

module.exports = router;