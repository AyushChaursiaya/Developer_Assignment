import { Router } from 'express';
import { Task } from './models';
const redisClient = require('./cache');
const amqp = require('amqplib');


const router = Router();
const RABBITMQ_URL = 'amqp://localhost';

// Connect to RabbitMQ
const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  return connection.createChannel();
};

// POST /tasks
router.post('/', async (req, res) => {
  try {
    const { name, completed } = req.body;
    const task = new Task({ name, completed });
    await task.save();

    // Send a message to RabbitMQ
    const channel = await connectRabbitMQ();
    await channel.assertQueue('task_queue');
    channel.sendToQueue('task_queue', Buffer.from(JSON.stringify({ name, completed })));

    // Clear cache
    redisClient.del('tasks');

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// GET /tasks
router.get('/', async (req, res) => {
  try {
    const cachedTasks = await redisClient.get('tasks');
    if (cachedTasks) {
      return res.json(JSON.parse(cachedTasks));
    }

    const tasks = await Task.find();
    redisClient.set('tasks', JSON.stringify(tasks));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Clear cache
    redisClient.del('tasks');

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

export { router as taskRouter };
