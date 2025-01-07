require('dotenv').config({
  path: process.cwd() + '/server/src/config/.env'
});  // Load environment variables from .env file
const { Kafka } = require('kafkajs');

// Use environment variables for Kafka configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,  // Get client ID from .env
  brokers: process.env.KAFKA_BROKERS.split(','),  // Parse brokers from .env
});

const groupName = process.env.KAFKA_TOPIC_SPOT_ORDER_GROUP;  // Topic name from .env
const topicName = process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING;  // Topic name from .env
const consumer = kafka.consumer({ groupId: groupName });

let messageCount = 0;
const maxMessages = 5; // Disconnect after receiving 5 messages

const run = async () => {
  // Connect to the Kafka broker
  await consumer.connect();

  // Subscribe to a Kafka topic (e.g., 'my-topic')
  await consumer.subscribe({ topic: topicName, fromBeginning: true });

  // Run the consumer to process incoming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);

      // Increment message count
      messageCount++;

      // If the message count reaches the threshold, disconnect the consumer
      if (messageCount >= maxMessages) {
        console.log('Max messages received, disconnecting...');
        await consumer.disconnect();
        console.log('Consumer disconnected');
      }
    },
  });
};

// Export the runConsumer function
module.exports = { runConsumer: run };