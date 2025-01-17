import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: process.env.KAFKA_BROKERS?.split(',') || ["localhost:9092"],
});

const producer = kafka.producer();
const admin = kafka.admin();

const topicName = process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING;
console.log('KAFKA_TOPIC_SPOT_ORDER_PENDING:', process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING);

export const checkAndCreateTopic = async () => {
  try {
    await admin.connect();
    console.log('Admin connected');

    const topics = await admin.listTopics();
    if (!topicName) {
      throw new Error('KAFKA_TOPIC_SPOT_ORDER_GROUP is not defined in .env');
    }
    if (!topics.includes(topicName)) {
      console.log(`Topic '${topicName}' not found. Creating topic...`);
      await admin.createTopics({
        topics: [{ topic: topicName }],
        waitForLeaders: true,  
      });
      console.log(`Topic '${topicName}' created successfully`);
    } else {
      console.log(`Topic '${topicName}' already exists`);
    }
  } catch (error) {
    console.error('Error checking or creating topic:', error);
  } finally {
    await admin.disconnect();
    console.log('Admin disconnected');
  }
};

export const runProducer = async () => {
  await producer.connect();
  console.log('Producer connected');

  // Send messages to the Kafka topic
  // let messageCount = 0;
  // const maxMessages = 5;

  // while (messageCount < maxMessages) {
  //   await producer.send({
  //     topic: topicName,
  //     messages: [
  //       { value: `Message #${messageCount + 1}` },
  //     ],
  //   });
  //   console.log(`Sent message #${messageCount + 1}`);

  //   messageCount++;

  //   // Check if we reached the message limit and disconnect
  //   if (messageCount >= maxMessages) {
  //     console.log('Max messages sent, disconnecting...');
  //     await producer.disconnect();
  //     console.log('Producer disconnected');
  //   }
  // }
};

// Run the topic check and producer
checkAndCreateTopic().then(runProducer).catch(console.error);

// Export the runConsumer function

