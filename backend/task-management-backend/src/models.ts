import mongoose from 'mongoose';

export interface ITask extends mongoose.Document {
  name: string;
  completed: boolean;
}

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
