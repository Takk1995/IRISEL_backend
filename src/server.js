const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8000;
const adminRoutes = require('./routes/adminApi')

app.use(cors());
app.use(express.json());
app.use('/api', adminRoutes);



app.listen(PORT, () => {console.log(`server is running on ${PORT}`);
})