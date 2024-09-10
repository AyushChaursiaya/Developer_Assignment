"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    completed: { type: Boolean, default: false }
});
exports.Task = mongoose_1.default.model('Task', taskSchema);
