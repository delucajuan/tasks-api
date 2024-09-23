import { Request, Response, NextFunction } from 'express';

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  const tasks = { task: 'test' };
  res.json(tasks);
};
