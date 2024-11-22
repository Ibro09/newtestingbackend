const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
const userRoutes = require('./Routes/Routes');
 
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from the public folder
app.use('/api', userRoutes);
const User = require("./Models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
  


// Define routes
app.get('/', async(req, res) => {
res.send('welcome')
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
