"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const express_1 = require("express");
const mongoose_1 = require("mongoose");
// const body_parser_1 = require("body-parser");
const bodyParser = require('body-parser');
const routes_1 = require("./routes");
const redis_1 = require("redis");
// Initialize Express
// const app = (0, express_1.default)();
const express = require('express');
const app = express();
const port = 3000;
// Redis Client
const redisClient = (0, redis_1.createClient)();
redisClient.on('error', (err) => console.error('Redis Client Error', err));
// MongoDB Connection
mongoose_1.default.connect('mongodb+srv://ayush:12345@cluster0.oo018hf.mongodb.net/FSD_Assignment')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Middleware
// app.use(body_parser_1.default.json());
app.use(bodyParser.json());
// Routes
app.use('/tasks', routes_1.taskRouter);

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
