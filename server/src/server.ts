// import app from 'app';
import KafkaSpotOrderProcessor from './helpers/consumer';
import { checkAndCreateTopic } from './helpers/producer';

import { config } from 'dotenv';
config();

// const PORT = process.env.PORT || 5000;

// const startServer = () => {
//   // Start the Express server
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// };

const startConsumer = async () => {
  try {
    console.log(process.env.KAFKA_TOPIC_SPOT_ORDER_PENDING)
    const kafkaSpotOrderProcessor = new KafkaSpotOrderProcessor()
    await kafkaSpotOrderProcessor.startConsumers();
    console.log('Consumer is running in the background');
  } catch (error) {
    console.error('Error while starting the consumer:', error);
  }
};

const startApplication = async () => {
  try {
    await checkAndCreateTopic();
    await startConsumer(); 
    // startServer();         
  } catch (error) {
    console.error('Error during application startup:', error);
  }
};

startApplication(); 
