const { OrderBook, Side, OrderType } = require("nodejs-order-book");
const { v4: uuidv4 } = require('uuid');

function generateOrderId() {
  return uuidv4();
}

const _maps = new Map();
_maps.set('BTC', new OrderBook({ tickSize: 0.01, depth: 100, }));
_maps.set('ETH', new OrderBook({ tickSize: 0.01, depth: 100, }));

function addOrder(symbol, order) {
  try {
    const orderBook = _maps.get(symbol);
    if (!orderBook) throw new Error(`Order book for ${symbol} not found`);

    const addedOrder = orderBook.createOrder(order);
    console.log(`Order added to ${symbol}: ${JSON.stringify(order)}`);
    return addedOrder;
  } catch (error) {
    console.error(`Error adding order for ${symbol}:`, error);
    throw error;
  }
}

function matchOrders(symbol) {
  const orderBook = _maps.get(symbol);
  if (!orderBook) throw new Error(`Order book for ${symbol} not found`);
  return orderBook;
  const trades = orderBook.matchOrders();
  if (trades.length > 0) {
    console.log(`Matched trades for ${symbol}:`, trades);
    return trades;
  }

  console.log(`No trades matched for ${symbol}`);
  return null;
}

exports.getOrderBook = (req, res) => {
  const btcOB = _maps.get('BTC');
  const ethOB = _maps.get('ETH');

  res.json({
    btcOB ,
    ethOB 
  });
};

exports.getExampleData = async (req, res) => {
  try {
    const { price, size, side, symbol } = req.body;

    if (price <= 0 || size <= 0) {
      return res.status(400).json({ message: "Invalid price or size" });
    }

    addOrder('ETH', { id: generateOrderId(),  price: 120, size: 3,  side: Side.SELL,  type: OrderType.LIMIT,});
    addOrder('ETH', { id: generateOrderId(),  price: 120, size: 1,  side: Side.SELL,  type: OrderType.LIMIT,});
    addOrder('ETH', { id: generateOrderId(),  price: 120, size: 2,  side: Side.SELL,  type: OrderType.LIMIT,});
    const or = addOrder('ETH', { id: generateOrderId(),  price: 130, size: 7,  side: Side.BUY,  type: OrderType.LIMIT,});

    // const addedOrder = addOrder(symbol, order);

    // Thực hiện khớp lệnh
    const trades = matchOrders('ETH');

    if (trades) {
      return res.json({
        message: "Trade executed successfully",
        or,
      });
    }

    return res.json({
      message: "Order added to the order book",
      order: addedOrder,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

