import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { ChangeTaskStatusInput, CreateTaskInput, UpdateTaskInput } from '../types/types';
import { TaskStatus } from '../entities/Task';
import { calculateDaysElapsed } from '../utils/dateUtils';

const taskRepository = AppDataSource.getRepository(Task);

const standarSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const createTask = async ({ title, description, status }: CreateTaskInput) => {
  const task = taskRepository.create({
    title,
    description,
    status,
  });

  await taskRepository.save(task);

  const formattedTask = {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };

  return formattedTask;
};

const getAllTasks = async () => {
  return await taskRepository.find({
    select: standarSelect,
  });
};

const getTaskById = async (id: number) => {
  return await taskRepository.findOne({
    select: standarSelect,
    where: { id },
  });
};

const updateTask = async ({ id, title, description }: UpdateTaskInput) => {
  const task = await taskRepository.findOneBy({ id });
  if (!task) {
    return null;
  }
  task.title = title ?? task.title;
  task.description = description ?? task.description;
  const updatedTask = await taskRepository.save(task);
  delete updatedTask.deletedAt;
  return updatedTask;
};

const deleteTask = async (id: number) => {
  const task = await taskRepository.findOneBy({ id });
  if (!task) {
    return null;
  }
  const result = await taskRepository.softDelete(id);
  if (!result.affected) {
    return null;
  }
  return { status: 200, message: 'Task successfully deleted' };
};

const getTasksByStatus = async (status: TaskStatus) => {
  return await taskRepository.find({
    select: standarSelect,
    where: { status },
  });
};

const changeTaskStatus = async ({ id, status }: ChangeTaskStatusInput) => {
  const task = await taskRepository.findOneBy({ id });
  if (!task) {
    return null;
  }
  task.status = status;
  const updatedTask = await taskRepository.save(task);
  delete updatedTask.deletedAt;
  return updatedTask;
};

const getDaysElapsed = async (id: number) => {
  const task = await taskRepository.findOneBy({ id });
  if (!task) {
    return null;
  }
  return calculateDaysElapsed(task.createdAt);
};

export default {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStatus,
  changeTaskStatus,
  getDaysElapsed,
};
