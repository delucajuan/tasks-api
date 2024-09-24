import { Request, Response, NextFunction } from 'express';
import tasksService from '../services/tasks';

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await tasksService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export default { getAllTasks };
