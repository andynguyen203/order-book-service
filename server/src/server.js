const app = require('./app');
const  kafkaSpotOrderProcessor = require('./helpers/consumer');
const { checkAndCreateTopic } = require('./helpers/producer'); // Import checkAndCreateTopic function
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
    await kafkaSpotOrderProcessor.startConsumers();
    console.log('Consumer is running in the background');
  } catch (error) {
    console.error('Error while starting the consumer:', error);
  }
};

const startApplication = async () => {
  try {
    await checkAndCreateTopic();

    // Run consumer and server
    await startConsumer(); // Start the Kafka consumer
    startServer();         // Start the HTTP server
  } catch (error) {
    console.error('Error during application startup:', error);
  }
};

startApplication(); 
