import { Request, Response, NextFunction } from 'express';
import tasksService from '../services/tasks';

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

export default { createTask, getAllTasks };
