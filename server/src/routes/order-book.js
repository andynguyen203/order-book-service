const express = require('express');
const router = express.Router();

// Order Book controller
const orderbookController = require('../controllers/order-book-service');

router.get('/example', orderbookController.getExampleData);
router.get('/orderbook', orderbookController.getOrderBook);

module.exports = router;
