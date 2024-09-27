import { calculateDaysElapsed } from '../utils/dateUtils';
import { TaskStatus } from '../entities/Task';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  softDelete: jest.fn(),
};

// Mock AppDataSource
jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue(mockRepository),
  },
}));

// Mock calculateDaysElapsed
jest.mock('../utils/dateUtils', () => ({
  calculateDaysElapsed: jest.fn(),
}));

import taskService from './tasks';

let mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.IN_PROGRESS,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Task Service', () => {
  describe('createTask', () => {
    it('should create and save a new task', async () => {
      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
      });

      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];

      mockRepository.find.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        select: expect.any(Object),
        where: { id: 1 },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    const input = {
      id: 1,
      title: 'New Title',
      description: 'New Description',
    };

    it('should update task title and/ or description', async () => {
      const updatedTask = {
        ...mockTask,
        title: 'New Title',
        description: 'New Description',
      };

      mockRepository.findOneBy.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(input);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTask);
      expect(result).toEqual(updatedTask);
    });

    it('should return null if task not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await taskService.updateTask(input);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should soft delete a task when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTask);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await taskService.deleteTask(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ status: 200, message: 'Task successfully deleted' });
    });

    it('should return null if no tasks affected', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTask);
      mockRepository.softDelete.mockResolvedValue({ affected: 0 });

      const result = await taskService.deleteTask(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeNull();
    });

    it('should return null if task is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await taskService.deleteTask(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeNull();
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks by status', async () => {
      const mockTasks = [
        { ...mockTask, status: TaskStatus.IN_PROGRESS },
        { ...mockTask, id: 2, status: TaskStatus.IN_PROGRESS },
      ];
      mockRepository.find.mockResolvedValue(mockTasks);

      const result = await taskService.getTasksByStatus(TaskStatus.IN_PROGRESS);

      expect(mockRepository.find).toHaveBeenCalledWith({
        select: expect.any(Object),
        where: { status: TaskStatus.IN_PROGRESS },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('changeTaskStatus', () => {
    const input = {
      id: 1,
      status: TaskStatus.COMPLETED,
    };

    it('should change the task status', async () => {
      const updatedTask = {
        ...mockTask,
        status: TaskStatus.COMPLETED,
      };

      mockRepository.findOneBy.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await taskService.changeTaskStatus(input);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTask);
      expect(result).toEqual(updatedTask);
    });

    it('should return null if task not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await taskService.changeTaskStatus(input);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeNull();
    });
  });

  describe('getDaysElapsed', () => {
    it('should return the days elapsed since task creation', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTask);
      (calculateDaysElapsed as jest.Mock).mockReturnValue(10);

      const result = await taskService.getDaysElapsed(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(calculateDaysElapsed).toHaveBeenCalledWith(mockTask.createdAt);
      expect(result).toEqual(10);
    });

    it('should return null if task is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await taskService.getDaysElapsed(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeNull();
    });
  });
});
