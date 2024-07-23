require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user'); 
const listRoutes = require('./routes/list'); 

const app = express();
const PORT = process.env.PORT || 3001; 

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', userRoutes);
app.use('/api/lists', listRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
