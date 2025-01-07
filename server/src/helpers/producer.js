require('dotenv').config();  // Load environment variables from .env file
const { Kafka } = require('kafkajs');

// Create a Kafka instance using environment variables
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,  // Get client ID from .env
  brokers: process.env.KAFKA_BROKERS.split(','),  // Parse brokers from .env
});

const producer = kafka.producer();
const admin = kafka.admin();

const topicName = process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING;  // Topic name from .env

const checkAndCreateTopic = async () => {
  try {
    await admin.connect();
    console.log('Admin connected');

    // Check if the topic already exists
    const topics = await admin.listTopics();
    if (!topics.includes(topicName)) {
      // If the topic doesn't exist, create it
      console.log(`Topic '${topicName}' not found. Creating topic...`);
      await admin.createTopics({
        topics: [{ topic: topicName }],
        waitForLeaders: true,  // Wait until all partitions are assigned to a leader
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

const runProducer = async () => {
  await producer.connect();
  console.log('Producer connected');

  // Send messages to the Kafka topic
  let messageCount = 0;
  const maxMessages = 5;

  while (messageCount < maxMessages) {
    await producer.send({
      topic: topicName,
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

// Run the topic check and producer
checkAndCreateTopic().then(runProducer).catch(console.error);

// Export the runConsumer function
module.exports = { checkAndCreateTopic };
