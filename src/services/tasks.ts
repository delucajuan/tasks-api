import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';

const getAllTasks = async (): Promise<Task[]> => {
  const taskRepository = AppDataSource.getRepository(Task);
  return await taskRepository.find();
};

export default { getAllTasks };
