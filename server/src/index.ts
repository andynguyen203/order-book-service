import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import KafkaSpotOrderProcessor from './helpers/consumer';
import { checkAndCreateTopic } from './helpers/producer';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 6666;


const startConsumer = async () => {
  try {
    const kafkaSpotOrderProcessor = new KafkaSpotOrderProcessor()
    await kafkaSpotOrderProcessor.startConsumers();
    console.log('Consumer is running in the background');
  } catch (error) {
    console.error('Error while starting the consumer:', error);
  }
};

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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
});
