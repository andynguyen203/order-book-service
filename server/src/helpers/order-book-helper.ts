const { OrderBook } = require("nodejs-order-book");

class OrderBookHelper {
  private _orderBooks; 

  constructor(tradingPairs: string[] = []) {
    this._orderBooks = new Map();
    tradingPairs.forEach(pair => this._orderBooks.set(pair, new OrderBook()));
  }

  addOrderBook(symbol) {
    if (this._orderBooks.has(symbol)) {
      throw new Error(`OrderBook for symbol ${symbol} already exists`);
    }
    this._orderBooks.set(symbol, new OrderBook());
  }

  removeOrderBook(symbol) {
    if (!this._orderBooks.has(symbol)) {
      throw new Error(`OrderBook for symbol ${symbol} does not exist`);
    }
    this._orderBooks.delete(symbol);
  }

  getOrderBook(symbol) {
    const orderBook = this._orderBooks.get(symbol);
    if (!orderBook) {
      throw new Error(`OrderBook for symbol ${symbol} does not exist`);
    }
    return orderBook;
  }

  addOrder(tradingPair, orderData) {
    const orderBook = this.getOrderBook(tradingPair);
    const order = {
      id: orderData._id,
      price: orderData.price,
      size: orderData.origSize,
      timeInForce: orderData.timeInForce,
      side: orderBook.side,
      type: orderBook.type
    }
    orderBook.addOrder(order);
  }

  removeOrder(symbol, order) {
    const orderBook = this.getOrderBook(symbol);
    orderBook.removeOrder(order);
  }

  matchOrders(symbol, marketOrder) {
    const orderBook = this.getOrderBook(symbol);
    return orderBook.matchOrders(marketOrder);
  }

  getOrderBookStats(symbol) {
    const orderBook = this.getOrderBook(symbol);
    return orderBook.getStats();
  }

  getSymbols() {
    return Array.from(this._orderBooks.keys());
  }

  getAllStats() {
    const stats = {};
    for (const [symbol, orderBook] of this._orderBooks.entries()) {
      stats[symbol] = orderBook.getStats();
    }
    return stats;
  }
}


// const tradingPairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
const orderBookHelper = new OrderBookHelper(['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);

export default orderBookHelper;

