const app = require('./app');
const { runConsumer } = require('./helpers/consumer');
const PORT = process.env.PORT || 5000;

const startServer = () => {
  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

const startConsumer = async () => {
  try {
    // Run the Kafka consumer in the background
    await runConsumer();  // Assuming runConsumer is an exported function from consumer.js
    console.log('Consumer is running in the background');
  } catch (error) {
    console.error('Error while starting the consumer:', error);
  }
};

// Run both server and consumer
startConsumer(); // Start the Kafka consumer
startServer();   // Start the HTTP server
