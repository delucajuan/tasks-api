import { Request, Response, NextFunction } from 'express';
import tasksController from './tasks';
import tasksService from '../services/tasks';
import { TaskStatus } from '../entities/Task';

jest.mock('../services/tasks');

const mockTasksService = jest.mocked(tasksService, { shallow: true });

let mockReq: Partial<Request> = {};
let mockRes: Partial<Response>;
let mockNext: NextFunction;

let mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.IN_PROGRESS,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  mockReq = {};
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  mockNext = jest.fn();
  jest.clearAllMocks();
});

describe('Task Controller', () => {
  describe('createTask', () => {
    const input = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };
    beforeEach(() => {
      mockReq.body = input;
    });

    it('should create a task and return status 201', async () => {
      mockTasksService.createTask.mockResolvedValue(mockTask);

      await tasksController.createTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.createTask).toHaveBeenCalledWith(input);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to create task');
      mockTasksService.createTask.mockRejectedValue(error);

      await tasksController.createTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];

      mockTasksService.getAllTasks.mockResolvedValue(mockTasks);

      await tasksController.getAllTasks(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.getAllTasks).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to fetch tasks');
      mockTasksService.getAllTasks.mockRejectedValue(error);

      await tasksController.getAllTasks(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTaskById', () => {
    beforeEach(() => {
      mockReq.params = { id: '1' };
    });

    it('should return a task by id', async () => {
      mockTasksService.getTaskById.mockResolvedValue(mockTask);

      await tasksController.getTaskById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.getTaskById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 if task is not found', async () => {
      mockTasksService.getTaskById.mockResolvedValue(null);

      await tasksController.getTaskById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ status: 404, message: 'Task not found' }),
      );
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to get task');
      mockTasksService.getTaskById.mockRejectedValue(error);

      await tasksController.getTaskById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTask', () => {
    const mockUpdatedTask = {
      ...mockTask,
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description',
    };
    const input = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description',
    };

    beforeEach(() => {
      mockReq.params = { id: String(input.id) };
      mockReq.body = input;
    });

    it('should update a task and return it', async () => {
      mockTasksService.updateTask.mockResolvedValue(mockUpdatedTask);

      await tasksController.updateTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.updateTask).toHaveBeenCalledWith(input);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    it('should return 404 if task is not found', async () => {
      mockTasksService.updateTask.mockResolvedValue(null);

      await tasksController.updateTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ status: 404, message: 'Task not found' }),
      );
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to update task');
      mockTasksService.updateTask.mockRejectedValue(error);

      await tasksController.updateTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteTask', () => {
    beforeEach(() => {
      mockReq.params = { id: '1' };
    });
    it('should delete a task and return success message', async () => {
      const mockResult = { status: 200, message: 'Task successfully deleted' };

      mockTasksService.deleteTask.mockResolvedValue(mockResult);

      await tasksController.deleteTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.deleteTask).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 if task is not found', async () => {
      mockTasksService.deleteTask.mockResolvedValue(null);

      await tasksController.deleteTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ status: 404, message: 'Task not found' }),
      );
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to delete task');
      mockTasksService.deleteTask.mockRejectedValue(error);

      await tasksController.deleteTask(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTasksByStatus', () => {
    beforeEach(() => {
      mockReq.params = { status: TaskStatus.IN_PROGRESS };
    });
    it('should return tasks by status', async () => {
      const mockTasks = [
        { ...mockTask, status: TaskStatus.IN_PROGRESS },
        { ...mockTask, id: 2, status: TaskStatus.IN_PROGRESS },
      ];

      mockTasksService.getTasksByStatus.mockResolvedValue(mockTasks);

      await tasksController.getTasksByStatus(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.getTasksByStatus).toHaveBeenCalledWith(TaskStatus.IN_PROGRESS);
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to get tasks');
      mockTasksService.getTasksByStatus.mockRejectedValue(error);

      await tasksController.getTasksByStatus(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('changeTaskStatus', () => {
    beforeEach(() => {
      mockReq.params = { id: '1' };
      mockReq.body = { status: TaskStatus.COMPLETED };
    });

    it('should change the task status and return the updated task', async () => {
      const updatedTask = {
        ...mockTask,
        status: TaskStatus.COMPLETED,
      };

      mockTasksService.changeTaskStatus.mockResolvedValue(updatedTask);

      await tasksController.changeTaskStatus(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.changeTaskStatus).toHaveBeenCalledWith({
        id: 1,
        status: TaskStatus.COMPLETED,
      });
      expect(mockRes.json).toHaveBeenCalledWith(updatedTask);
    });

    it('should return 404 if task is not found', async () => {
      mockTasksService.changeTaskStatus.mockResolvedValue(null);

      await tasksController.changeTaskStatus(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ status: 404, message: 'Task not found' }),
      );
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to change task status');
      mockTasksService.changeTaskStatus.mockRejectedValue(error);

      await tasksController.changeTaskStatus(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getDaysElapsed', () => {
    beforeEach(() => {
      mockReq.params = { id: '1' };
    });

    it('should return the days elapsed since task creation', async () => {
      const mockDaysElapsed = 5;

      mockTasksService.getDaysElapsed.mockResolvedValue(mockDaysElapsed);

      await tasksController.getDaysElapsed(mockReq as Request, mockRes as Response, mockNext);

      expect(mockTasksService.getDaysElapsed).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({ daysElapsed: mockDaysElapsed });
    });

    it('should return 404 if task is not found', async () => {
      mockTasksService.getDaysElapsed.mockResolvedValue(null);

      await tasksController.getDaysElapsed(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ status: 404, message: 'Task not found' }),
      );
    });

    it('should handle errors and call next with error', async () => {
      const error = new Error('Failed to get days elapsed');
      mockTasksService.getDaysElapsed.mockRejectedValue(error);

      await tasksController.getDaysElapsed(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
