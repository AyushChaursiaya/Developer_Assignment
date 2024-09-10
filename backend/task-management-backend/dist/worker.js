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
const amqp = require('amqplib');
const RABBITMQ_URL = 'amqp://localhost';
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield amqp.connect(RABBITMQ_URL);
    const channel = yield connection.createChannel();
    yield channel.assertQueue('task_queue');
    channel.consume('task_queue', (msg) => {
        if (msg) {
            const task = JSON.parse(msg.content.toString());
            console.log(`Task Created: ${task.name}`);
            channel.ack(msg);
        }
    });
});
connectRabbitMQ().catch(console.error);
