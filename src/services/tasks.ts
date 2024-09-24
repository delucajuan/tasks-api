import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { CreateTaskInput } from '../types/types';

const createTask = async ({ title, description, status }: CreateTaskInput) => {
  const taskRepository = AppDataSource.getRepository(Task);

  const task = taskRepository.create({
    title,
    description,
    status,
  });

  await taskRepository.save(task);
  return task;
};

const getAllTasks = async () => {
  const taskRepository = AppDataSource.getRepository(Task);
  return await taskRepository.find();
};

export default { createTask, getAllTasks };
