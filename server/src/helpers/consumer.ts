// require('dotenv').config({
//   path: process.cwd() + '/server/src/config/.env',
// });

import { Kafka } from 'kafkajs';
import orderBookHelper from "./order-book-helper";

class KafkaSpotOrderProcessor {
  private kafka;
  private groupName: string;
  private topicPending: string;
  private topicComplete: string;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: process.env.KAFKA_BROKERS?.split(',') || [],
    });

    this.groupName = process.env.KAFKA_TOPIC_SPOT_ORDER_GROUP || "spot-order-group";
    this.topicPending = process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING || "";
    this.topicComplete = process.env.KAFKA_TOPIC_SPOT_ORDER_COMPLETE || "";
  }

  async processPendingOrders() {
    const consumer = this.kafka.consumer({ groupId: this.groupName });
    await consumer.connect();
    await consumer.subscribe({ topic: this.topicPending, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message?.value?.toString();
        console.log(`[Pending Orders] Received: ${messageValue}`);
        if (messageValue) {
          try {
            const orderData = JSON.parse(messageValue);
            console.log(orderData)

            const tradingPair = orderData.baseAsset + orderData.quoteAsset;
            console.log(tradingPair)
            orderBookHelper.addOrder(tradingPair, orderData);
            console.log(`[Pending Orders] Order added to ${tradingPair} order book.`);
          } catch (error: any) {
            console.error(`[Pending Orders] Error: ${error.message}`);
          }
        }

      },
    });
  }

  /**
   * Process completed orders
   */
  async processCompletedOrders() {
    const consumer = this.kafka.consumer({ groupId: this.groupName });
    await consumer.connect();
    await consumer.subscribe({ topic: this.topicComplete, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message?.value?.toString();
        console.log(`[Completed Orders] Received: ${messageValue}`);
        if (!messageValue) return;
        try {
          const orderData = JSON.parse(messageValue);
          console.log(orderData)
          const { symbol, order } = orderData;

          // Remove the order from the order book
          orderBookHelper.removeOrder(symbol, order);
          console.log(`[Completed Orders] Order removed from ${symbol} order book.`);
        } catch (error: any) {
          console.error(`[Completed Orders] Error: ${error.message}`);
        }
      },
    });
  }

  async startConsumers() {
    await Promise.all([this.processPendingOrders(), this.processCompletedOrders()]);
    console.log('Kafka consumers are running.');
  }
}
export default KafkaSpotOrderProcessor
