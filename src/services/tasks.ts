import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { CreateTaskInput } from '../types/types';
import { TaskStatus } from '../entities/Task';

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

const getTasksByStatus = async (status: TaskStatus) => {
  return await taskRepository.findBy({ status });
};

export default { createTask, getAllTasks, getTaskById, getTasksByStatus };
