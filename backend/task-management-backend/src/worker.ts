const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';

const connectRabbitMQ = async () => {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('task_queue');

    channel.consume('task_queue', (msg: any) => {
        if (msg) {
            const task = JSON.parse(msg.content.toString());
            console.log(`Task Created: ${task.name}`);
            channel.ack(msg);
        }
    });
};

connectRabbitMQ().catch(console.error);
