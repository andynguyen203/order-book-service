const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Example route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Example of including external route files
const orderbookRoutes = require('./routes/order-book');
app.use('/api', orderbookRoutes);

export default app;
