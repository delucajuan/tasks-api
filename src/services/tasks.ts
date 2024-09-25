import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { CreateTaskInput, UpdateTaskInput } from '../types/types';
import { TaskStatus } from '../entities/Task';

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
  delete task.deletedAt;
  return task;
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
  if (task) {
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    const updatedTask = await taskRepository.save(task);
    delete updatedTask.deletedAt;
    return updatedTask;
  }
  return null;
};

const deleteTask = async (id: number) => {
  const task = await taskRepository.findOneBy({ id });
  if (task) {
    const result = await taskRepository.softDelete(id);
    if (result.affected) {
      return { status: 200, message: 'Task successfully deleted' };
    }
  }
  return null;
};

const getTasksByStatus = async (status: TaskStatus) => {
  return await taskRepository.find({
    select: standarSelect,
    where: { status },
  });
};

export default { createTask, getAllTasks, getTaskById, getTasksByStatus, updateTask, deleteTask };
