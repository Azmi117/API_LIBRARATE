require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const router = require('./routes');

app.use(express.json());
app.use(cors());
app.use('/api', router);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});