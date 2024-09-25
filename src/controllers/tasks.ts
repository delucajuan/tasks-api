import { Request, Response, NextFunction } from 'express';
import tasksService from '../services/tasks';
import { HttpError } from '../types/types';
import { TaskStatus } from '../entities/Task';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, status } = req.body;
    const newTask = await tasksService.createTask({ title, description, status });
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await tasksService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const task = await tasksService.getTaskById(id);
    if (!task) {
      const notFoundError: HttpError = new Error('Task not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description } = req.body;
    const updatedTask = await tasksService.updateTask({ id, title, description });
    if (!updatedTask) {
      const notFoundError: HttpError = new Error('Task not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const result = await tasksService.deleteTask(id);
    if (!result) {
      const notFoundError: HttpError = new Error('Task not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getTasksByStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.params;
    const taskStatus = status as TaskStatus;
    const tasks = await tasksService.getTasksByStatus(taskStatus);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const changeTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const updatedTask = await tasksService.changeTaskStatus({ id, status });
    if (!updatedTask) {
      const notFoundError: HttpError = new Error('Task not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export default {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStatus,
  changeTaskStatus,
};
