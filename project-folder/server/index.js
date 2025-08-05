const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const signRoutes = require('./routes/sign');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/upload', uploadRoutes);
app.use('/api/sign', signRoutes);

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
