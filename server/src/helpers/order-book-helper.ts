import { OrderBook } from "nodejs-order-book";

class OrderBookHelper {
  private _orderBooks;

  constructor(tradingPairs: string[] = []) {
    this._orderBooks = new Map();
    tradingPairs.forEach(pair => this._orderBooks.set(pair, new OrderBook()));
  }

  addOrderBook(tradingPair: string) {
    if (this._orderBooks.has(tradingPair)) {
      throw new Error(`OrderBook for tradingPair ${tradingPair} already exists`);
    }
    this._orderBooks.set(tradingPair, new OrderBook());
  }

  removeOrderBook(tradingPair: string) {
    if (!this._orderBooks.has(tradingPair)) {
      throw new Error(`OrderBook for tradingPair ${tradingPair} does not exist`);
    }
    this._orderBooks.delete(tradingPair);
  }

  getOrderBook(tradingPair: string) {
    const orderBook = this._orderBooks.get(tradingPair);
    if (!orderBook) {
      throw new Error(`OrderBook for tradingPair ${tradingPair} does not exist`);
    }
    return orderBook;
  }

  addOrder(tradingPair: string, orderData: any) {
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

  removeOrder(tradingPair: string, order: any) {
    const orderBook = this.getOrderBook(tradingPair);
    orderBook.removeOrder(order);
  }

  matchOrders(tradingPair: string, marketOrder: any) {
    const orderBook = this.getOrderBook(tradingPair);
    return orderBook.matchOrders(marketOrder);
  }

  getOrderBookStats(tradingPair: string) {
    const orderBook = this.getOrderBook(tradingPair);
    return orderBook.getStats();
  }

  gettradingPairs() {
    return Array.from(this._orderBooks.keys());
  }

  // getAllStats() {
  //   const stats: any = {};
  //   for (const [tradingPair, orderBook] of this._orderBooks.entries()) {
  //     stats[tradingPair] = orderBook.getStats();
  //   }
  //   return stats;
  // }
}


// const tradingPairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
const orderBookHelper = new OrderBookHelper(['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);

export default orderBookHelper;

