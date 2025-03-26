const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes'); 
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', restaurantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
