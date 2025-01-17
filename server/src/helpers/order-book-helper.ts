import { OrderBook } from "nodejs-order-book";

class OrderBookHelper {
  private _orderBooks;

  constructor(tradingPairs: string[] = []) {
    this._orderBooks = new Map<string, OrderBook>();
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
      id: orderData.orderId,
      price: orderData.price,
      size: orderData.origSize,
      timeInForce: orderData.timeInForce,
      side: orderData.side.toLowerCase(),
      type: orderData.type.toLowerCase(),
    }

    const result = orderBook.createOrder(order);
    if (result.done.length > 0 || result.partial) {
      console.log(`Matched trades for ${tradingPair}:`, result);
      return result
    } else {
      console.log(`Error:`, result);
      return null
    }
  }


  removeOrder(tradingPair: string, orderId: string) {
    const orderBook = this.getOrderBook(tradingPair);
    const removedOrder = orderBook.cancel(orderId);
    if (removedOrder) {
      console.log(`Order ${orderId} removed from ${tradingPair}`);
    } else {
      console.log(`Order ${orderId} not found in ${tradingPair}`);
    }
  }

  matchOrders(tradingPair: string, marketOrder: any) {
    const orderBook = this.getOrderBook(tradingPair);
    const result = orderBook.createOrder(marketOrder);
    console.log(`Market order matched for ${tradingPair}:`, result);
    return result;
  }

  getOrderBookStats(tradingPair: string) {
    const orderBook = this.getOrderBook(tradingPair);
    return orderBook.snapshot();
  }

  getTradingPairs() {
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

