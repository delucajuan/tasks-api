import {
  createTaskSchema,
  getTaskByIdSchema,
  getTasksByStatusSchema,
  updateTaskSchema,
} from './taskValidators';
import { TaskStatus } from '../entities/Task';

describe('Task Validator Schemas', () => {
  describe('createTaskSchema', () => {
    it('should pass validation with valid data', () => {
      const validData = {
        title: 'New Task',
        description: 'Task description',
        status: TaskStatus.IN_PROGRESS,
      };
      const { error } = createTaskSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail validation with missing title', () => {
      const invalidData = {
        description: 'Task description',
      };
      const { error } = createTaskSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('getTaskByIdSchema', () => {
    it('should pass validation with valid ID', () => {
      const validData = { id: 1 };
      const { error } = getTaskByIdSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail validation with non-integer ID', () => {
      const invalidData = { id: 'abc' };
      const { error } = getTaskByIdSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should fail validation with negative ID', () => {
      const invalidData = { id: -5 };
      const { error } = getTaskByIdSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('getTasksByStatusSchema', () => {
    it('should pass validation with valid status', () => {
      const validData = { status: TaskStatus.COMPLETED };
      const { error } = getTasksByStatusSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail validation with invalid status', () => {
      const invalidData = { status: 'invalid-status' };
      const { error } = getTasksByStatusSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('updateTaskSchema', () => {
    it('should pass validation with a valid title or description', () => {
      const validData = { title: 'Updated title' };
      const { error } = updateTaskSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail validation with missing title and description', () => {
      const invalidData = {};
      const { error } = updateTaskSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should pass validation with both title and description', () => {
      const validData = { title: 'Updated title', description: 'Updated description' };
      const { error } = updateTaskSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
});
