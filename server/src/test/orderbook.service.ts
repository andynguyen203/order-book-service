import { OrderBook, CreateOrderOptions, OrderType, Side } from "nodejs-order-book";
export default class TestOrderBookService{
    public testAdd4BuyOrder1SellOrderMatchNoOrder(ob: OrderBook): void{
        let cnt = 1;
        const buyOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 2, price: 100 };
        const buyOD2: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 3, price: 110 };
        const buyOD3: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 5, price: 120 };
        const buyOD4: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 7, price: 130 };

        const sellOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 7, price: 140 };
    
        ob.createOrder(buyOD1);
        ob.createOrder(buyOD2);
        ob.createOrder(buyOD3);
        ob.createOrder(buyOD4);
        ob.createOrder(sellOD1);
    }

    public testAdd4BuyOrder1SellOrderMatchOrder130(ob: OrderBook): void{
        let cnt = 1;
        const buyOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 2, price: 100 };
        const buyOD2: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 3, price: 110 };
        const buyOD3: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 5, price: 120 };
        const buyOD4: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 7, price: 130 };

        const sellOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 7, price: 130 };
    
        ob.createOrder(buyOD1);
        ob.createOrder(buyOD2);
        ob.createOrder(buyOD3);
        ob.createOrder(buyOD4);
        ob.createOrder(sellOD1);
    }

    public testAdd4BuyOrder2SellOrderMatchOrder130(ob: OrderBook): void{
        let cnt = 1;
        const buyOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 2, price: 100 };
        const buyOD2: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 3, price: 110 };
        const buyOD3: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 5, price: 120 };
        const buyOD4: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 7, price: 130 };

        const sellOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 7, price: 140 };
        const sellOD2: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 7, price: 130 };
    
        ob.createOrder(buyOD1);
        ob.createOrder(buyOD2);
        ob.createOrder(buyOD3);
        ob.createOrder(buyOD4);
        ob.createOrder(sellOD1);
        ob.createOrder(sellOD2);
    }

    public testAdd1BuyOrder4SellOrderMatchNoOrder(ob: OrderBook): void{
        let cnt = 1;
        const buyOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 2, price: 100 };
        const buyOD2: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 3, price: 110 };
        const buyOD3: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 5, price: 120 };
        const buyOD4: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.SELL, size: 7, price: 130 };

        const sellOD1: CreateOrderOptions = { id: `orderid${cnt++}`, type: OrderType.LIMIT, side: Side.BUY, size: 7, price: 90 };
    
        ob.createOrder(buyOD1);
        ob.createOrder(buyOD2);
        ob.createOrder(buyOD3);
        ob.createOrder(buyOD4);
        ob.createOrder(sellOD1);
    }
}