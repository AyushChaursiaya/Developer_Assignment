"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const models_1 = require("./models");
const redisClient = require('./cache');
const amqp = require('amqplib');
const router = (0, express_1.Router)();
exports.taskRouter = router;
const RABBITMQ_URL = 'amqp://localhost';
// Connect to RabbitMQ
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield amqp.connect(RABBITMQ_URL);
    return connection.createChannel();
});
// POST /tasks
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, completed } = req.body;
        const task = new models_1.Task({ name, completed });
        yield task.save();
        // Send a message to RabbitMQ
        const channel = yield connectRabbitMQ();
        yield channel.assertQueue('task_queue');
        channel.sendToQueue('task_queue', Buffer.from(JSON.stringify({ name, completed })));
        // Clear cache
        redisClient.del('tasks');
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
}));
// GET /tasks
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedTasks = yield redisClient.get('tasks');
        if (cachedTasks) {
            return res.json(JSON.parse(cachedTasks));
        }
        const tasks = yield models_1.Task.find();
        redisClient.set('tasks', JSON.stringify(tasks));
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
}));
// PUT /tasks/:id
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield models_1.Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task)
            return res.status(404).json({ error: 'Task not found' });
        // Clear cache
        redisClient.del('tasks');
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
}));
