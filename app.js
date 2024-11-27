require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes');
const {errorMiddleware} = require('./middlewares/errorMiddleware');

app.use(express.json());
app.use(cors());
app.use('/api', router);
app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

module.exports = app;