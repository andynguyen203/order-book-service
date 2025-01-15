const { OrderBook, OrderSide, Side, OrderType } = require("nodejs-order-book");
const { v4: uuidv4 } = require('uuid');

function generateOrderId() {
  return uuidv4();
}

// Khởi tạo order book với các tham số như tick size và depth
const orderBook = new OrderBook({
  tickSize: 0.01, // Granularity (tính giá trị nhỏ nhất của đơn hàng)
  depth: 100, // Số lượng đơn hàng có thể lưu trữ
});
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
    BTC: btcOB ? btcOB.toJSON() : null,
    ETH: ethOB ? ethOB.toJSON() : null,
  });
};

exports.getExampleData = async (req, res) => {
  try {
    const { price, size, side, symbol } = req.body;

    if (!price || price <= 0 || !size || size <= 0) {
      return res.status(400).json({ message: "Invalid price or size" });
    }

    const orderId = generateOrderId();

    const order = {
      id: orderId,
      price,
      size,
      side,
      type: OrderType.LIMIT,
    };

    const addedOrder = addOrder(symbol, order);

    // Thực hiện khớp lệnh
    const trades = matchOrders(symbol);

    if (trades) {
      return res.json({
        message: "Trade executed successfully",
        trades,
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

