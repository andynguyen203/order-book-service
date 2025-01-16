import { OrderBook, Side, OrderType } from "nodejs-order-book";
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";

// Hàm tạo ID cho lệnh
function generateOrderId(): string {
  return uuidv4();
}

// Khởi tạo các order book cho từng loại tài sản
// const _maps = new Map<string, OrderBook>();
// _maps.set('BTC', new OrderBook({ tickSize: 0.01, depth: 100 }));
// _maps.set('ETH', new OrderBook({ tickSize: 0.01, depth: 100 }));

// // Thêm lệnh vào order book
// function addOrder(symbol: string, order: any) {
//   try {
//     const orderBook = _maps.get(symbol);
//     if (!orderBook) throw new Error(`Order book for ${symbol} not found`);

//     const addedOrder = orderBook.createOrder(order);
//     console.log(`Order added to ${symbol}: ${JSON.stringify(order)}`);
//     return addedOrder;
//   } catch (error) {
//     console.error(`Error adding order for ${symbol}:`, error);
//     throw error;
//   }
// }

// Khớp lệnh trong order book
// function matchOrders(symbol: string) {
//   const orderBook = _maps.get(symbol);
//   if (!orderBook) throw new Error(`Order book for ${symbol} not found`);
//   const trades = orderBook.matchOrders();
//   if (trades.length > 0) {
//     console.log(`Matched trades for ${symbol}:`, trades);
//     return trades;
//   }

//   console.log(`No trades matched for ${symbol}`);
//   return null;
// }

// // API: Lấy thông tin order book
// export const getOrderBook = (req: Request, res: Response) => {
//   const btcOB = _maps.get('BTC');
//   const ethOB = _maps.get('ETH');

//   res.json({
//     btcOB,
//     ethOB
//   });
// };

// // API: Thêm lệnh ví dụ và khớp lệnh
// export const getExampleData = async (req: Request, res: Response) => {
//   try {
//     const { price, size, side, symbol } = req.body;

//     if (price <= 0 || size <= 0) {
//       return res.status(400).json({ message: "Invalid price or size" });
//     }

//     // Thêm lệnh vào order book ETH
//     addOrder('ETH', { id: generateOrderId(), price: 120, size: 3, side: Side.SELL, type: OrderType.LIMIT });
//     addOrder('ETH', { id: generateOrderId(), price: 120, size: 1, side: Side.SELL, type: OrderType.LIMIT });
//     addOrder('ETH', { id: generateOrderId(), price: 120, size: 2, side: Side.SELL, type: OrderType.LIMIT });
//     const order = addOrder('ETH', { id: generateOrderId(), price: 130, size: 7, side: Side.BUY, type: OrderType.LIMIT });

//     // Thực hiện khớp lệnh
//     const trades = matchOrders('ETH');

//     if (trades) {
//       return res.json({
//         message: "Trade executed successfully",
//         trades,
//         order
//       });
//     }

//     return res.json({
//       message: "Order added to the order book",
//       order
//     });
//   } catch (error) {
//     console.error("Error processing order:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
