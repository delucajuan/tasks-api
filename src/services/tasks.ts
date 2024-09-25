import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { CreateTaskInput } from '../types/types';

const taskRepository = AppDataSource.getRepository(Task);

const createTask = async ({ title, description, status }: CreateTaskInput) => {
  const task = taskRepository.create({
    title,
    description,
    status,
  });

  await taskRepository.save(task);
  return task;
};

const getAllTasks = async () => {
  return await taskRepository.find();
};

const getTaskById = async (id: number) => {
  return await taskRepository.findOneBy({ id });
};

export default { createTask, getAllTasks, getTaskById };
