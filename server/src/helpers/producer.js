require('dotenv').config();  // Load environment variables from .env file
const { Kafka } = require('kafkajs');

// Create a Kafka instance using environment variables
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,  // Get client ID from .env
  brokers: process.env.KAFKA_BROKERS.split(','),  // Parse brokers from .env
});

const producer = kafka.producer();

let messageCount = 0;
const maxMessages = 5; // Disconnect after sending 5 messages

const runProducer = async () => {
  await producer.connect();
  console.log('Producer connected');

  // Send messages to the Kafka topic
  while (messageCount < maxMessages) {
    await producer.send({
      topic: process.env.KAFKA_TOPIC_SPOT_ORDER,
      messages: [
        { value: `Message #${messageCount + 1}` },
      ],
    });
    console.log(`Sent message #${messageCount + 1}`);

    messageCount++;

    // Check if we reached the message limit and disconnect
    if (messageCount >= maxMessages) {
      console.log('Max messages sent, disconnecting...');
      await producer.disconnect();
      console.log('Producer disconnected');
    }
  }
};

// Run the producer
runProducer().catch(console.error);

// Optional: Gracefully handle shutdown
process.on('SIGINT', async () => {
  await producer.disconnect();
  console.log('Producer disconnected');
  process.exit(0);
});
