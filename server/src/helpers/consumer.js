require('dotenv').config({
  path: process.cwd() + '/server/src/config/.env',
});
const { Kafka } = require('kafkajs');
const orderBookHelper = require('./order-book-helper');

class KafkaSpotOrderProcessor {
  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: process.env.KAFKA_BROKERS?.split(','),
    });

    this.groupName = process.env.KAFKA_TOPIC_SPOT_ORDER_GROUP; 
    this.topicPending = process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING; 
    this.topicComplete = process.env.KAFKA_TOPIC_SPOT_ORDER_COMPLETE; 
  }

  async processPendingOrders() {
    const consumer = this.kafka.consumer({ groupId: this.groupName });
    await consumer.connect();
    await consumer.subscribe({ topic: this.topicPending, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value.toString();
        console.log(`[Pending Orders] Received: ${messageValue}`);

        try {
          const orderData = JSON.parse(messageValue);
          console.log(orderData)

          const tradingPair = orderData.baseAsset + orderData.quoteAsset;

          orderBookHelper.addOrder(tradingPair, orderData);
          orderBookHelper.printOrder()
          console.log(`[Pending Orders] Order added to ${symbol} order book.`);
        } catch (error) {
          console.error(`[Pending Orders] Error: ${error.message}`);
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
        const messageValue = message.value.toString();
        console.log(`[Completed Orders] Received: ${messageValue}`);

        try {
          const orderData = JSON.parse(messageValue);
          console.log(orderData)
          const { symbol, order } = orderData;

          // Remove the order from the order book
          orderBookHelper.removeOrder(symbol, order);
          console.log(`[Completed Orders] Order removed from ${symbol} order book.`);
        } catch (error) {
          console.error(`[Completed Orders] Error: ${error.message}`);
        }
      },
    });
  }

  /**
   * Start all Kafka consumers
   */
  async startConsumers() {
    console.log('Starting Kafka consumers...');
    await Promise.all([this.processPendingOrders(), this.processCompletedOrders()]);
    console.log('Kafka consumers are running.');
  }
}

const kafkaSpotOrderProcessor = new KafkaSpotOrderProcessor();

module.exports = kafkaSpotOrderProcessor;

