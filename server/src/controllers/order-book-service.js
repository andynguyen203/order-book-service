const { OrderBook, OrderSide, Side, OrderType } = require("nodejs-order-book");

// Khởi tạo order book với các tham số như tick size và depth
const orderBook = new OrderBook({
  tickSize: 0.01, // Granularity (tính giá trị nhỏ nhất của đơn hàng)
  depth: 100, // Số lượng đơn hàng có thể lưu trữ
});

// Hàm thêm lệnh vào order book
function addOrder(order) {
  try {
    const or = orderBook.createOrder(order);
    console.log(`Đã thêm lệnh: ${JSON.stringify(order)}`);
    return or;
  } catch (error) {
    console.error("Lỗi khi thêm lệnh:", error);
    throw error;
  }
}

// Hàm kiểm tra và khớp lệnh trong order book
function matchOrders() {
  return true;
  // Lấy các side của order book
  const bids = orderBook.bids; // Lệnh mua (buy)
  const asks = orderBook.asks; // Lệnh bán (sell)

  // Tìm "best bid" (lệnh mua cao nhất) và "best ask" (lệnh bán thấp nhất)
  const bestBid = bids.maxPriceQueue(); // Lệnh mua cao nhất
  const bestAsk = asks.minPriceQueue(); // Lệnh bán thấp nhất

  if (bestBid && bestAsk && bestBid.price() >= bestAsk.price()) {
    const tradeQuantity = Math.min(bestBid.volume(), bestAsk.volume()); // Số lượng giao dịch
    const tradePrice = bestAsk.price(); // Giá giao dịch

    // Thực hiện giao dịch (thực tế bạn sẽ chuyển tiền hoặc tài sản ở đây)
    console.log(
      `Giao dịch đã được thực hiện: ${tradeQuantity} với giá ${tradePrice}`
    );

    // Loại bỏ các lệnh đã khớp từ order book
    orderBook.removeOrder(bestBid);
    orderBook.removeOrder(bestAsk);

    return { price: tradePrice, quantity: tradeQuantity };
  } else {
    console.log("Không có lệnh phù hợp để khớp");
    return null;
  }
}

// API để đặt lệnh mua hoặc bán
exports.getExampleData = async (req, res) => {
  try {
    const { price, size, side } = req.body; // Nhận thông tin lệnh từ yêu cầu

    // Kiểm tra giá trị hợp lệ của lệnh
    if (price <= 0 || size <= 0) {
      return res
        .status(400)
        .json({ message: "Giá hoặc số lượng không hợp lệ" });
    }

    // const order = { price: 100, size: 5, side: Side.BUY };

    // Đếm số lượng đơn hàng đã thêm vào order book
    let orderIdCounter = 1;
    // Thêm lệnh vào order book
    addOrder({ id: `order-${orderIdCounter++}`, price: 120, size: 3, side: Side.SELL, type: OrderType.LIMIT });
    addOrder({ id: `order-${orderIdCounter++}`, price: 120, size: 3, side: Side.SELL, type: OrderType.LIMIT });
    addOrder({ id: `order-${orderIdCounter++}`, price: 120, size: 1, side: Side.SELL, type: OrderType.LIMIT });

    const or = addOrder({ id: `order-${orderIdCounter++}`,price: 120, size: 8, side: Side.BUY, type: OrderType.LIMIT });

    // Kiểm tra và thực hiện khớp lệnh
    const trade = matchOrders();

    if (trade) {
      return res.json({
        message: "Giao dịch đã được thực hiện thành công",
        order: or,
      });
    } else {
      return res.json({
        message: "Lệnh đã được thêm vào order book",
      });
    }
  } catch (error) {
    console.error("Lỗi khi đặt lệnh:", error);
    return res.status(500).json({ message: "Lỗi khi xử lý lệnh" });
  }
};
