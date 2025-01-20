import { Kafka } from 'kafkajs';
import orderBookHelper from "./order-book-helper";
import dotenv from 'dotenv';
import path from 'path';
import TestOrderBookService from '../test/orderbook.service';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class KafkaSpotOrderProcessor {
  private kafka;
  private groupName: string | undefined;
  private topicPending: string | undefined;
  private topicComplete: string | undefined;
  private producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: process.env.KAFKA_BROKERS?.split(',') || [],
    });

    this.groupName = process.env.KAFKA_TOPIC_SPOT_ORDER_GROUP;
    this.topicPending = process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING;
    this.topicComplete = process.env.KAFKA_TOPIC_SPOT_ORDER_COMPLETE;
    this.producer = this.kafka.producer();
  }

  async sendKafkaMessage(topic: string, message: object) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      console.log(`Message sent to Kafka topic ${topic}:`, message);
    } catch (error) {
      console.error('Error sending Kafka message:', error);
    }
  }


  checkAndCreateTopic = async () => {
    const admin = this.kafka.admin();

    try {
      await admin.connect();
      console.log('Kafka admin connected.');

      const topicList = [this.topicPending, this.topicComplete]


      console.log(`Ensuring topics: ${topicList.join(', ')}`);
      const existingTopics = await admin.listTopics();

      const topicsToCreate = topicList.filter(topic => !existingTopics.includes(topic!));
      if (topicsToCreate.length > 0) {
        await admin.createTopics({
          topics: topicsToCreate.map(topic => ({ topic: topic! })),
          waitForLeaders: true,
        });
        console.log(`Topics created successfully: ${topicsToCreate.join(', ')}`);
      } else {
        console.log('All topics already exist.');
      }
    } catch (error: any) {
      console.error(`Error ensuring topics: ${error.message}`);
    } finally {
      await admin.disconnect();
      console.log('Kafka admin disconnected.');
    }
  }

  private async processSpotResult(result: any) {
    if (!result) return;

    for (const doneTransaction of result.done) {
      await this.sendKafkaMessage(this.topicComplete!, {
        status: 'done',
        transaction: doneTransaction,
      });
    }

    if (result.partial) {
      await this.sendKafkaMessage(this.topicComplete!, {
        status: 'partial',
        transaction: {
          ...result.partial,
          partialQuantityProcessed: result.partialQuantityProcessed,
        },
      });
    }
  }

  async processPendingOrders() {
    if (!this.groupName || !this.topicPending || !this.topicComplete) return

    const consumer = this.kafka.consumer({ groupId: this.groupName });

    await consumer.connect();
    await consumer.subscribe({ topic: this.topicPending, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message?.value?.toString();
        if (messageValue) {
          try {

            const orderData = JSON.parse(messageValue);
            const tradingPair = orderData.baseAsset + orderData.quoteAsset;
            const result = orderBookHelper.addOrder(tradingPair, orderData);
            await this.processSpotResult(result);

          } catch (error: any) {
            console.error(`[Pending Orders] Error: ${error.message}`);
          }
        }

      },
    });
  }

  async startConsumers() {
    try {
      await this.checkAndCreateTopic();
      await this.producer.connect();

      const testService = new TestOrderBookService();
      const ob = orderBookHelper.getOrderBook('ETHUSDT');
      testService.testAdd4BuyOrder1SellOrderMatchNoOrder(ob);
      console.log("-------------------------------------------------");
      console.log(ob.snapshot());
      
      await this.processPendingOrders();
      console.log('Kafka consumers are running.');
    } catch (error:any) {
      console.error('Error starting Kafka consumers:', error.message);
    }
  }
}
export default KafkaSpotOrderProcessor


/**
  * Process completed orders
  */
// async processCompletedOrders() {

//   if (!this.groupName || !this.topicComplete) return

//   const consumer = this.kafka.consumer({ groupId: this.groupName });
//   await consumer.connect();
//   await consumer.subscribe({ topic: this.topicComplete, fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       const messageValue = message?.value?.toString();
//       console.log(`[Completed Orders] Received: ${messageValue}`);
//       if (!messageValue) return;
//       try {
//         const orderData = JSON.parse(messageValue);
//         console.log(orderData)
//         const { symbol, order } = orderData;

//         orderBookHelper.removeOrder(symbol, order);
//         console.log(`[Completed Orders] Order removed from ${symbol} order book.`);
//       } catch (error: any) {
//         console.error(`[Completed Orders] Error: ${error.message}`);
//       }
//     },
//   });
// }