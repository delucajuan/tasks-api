import { Router } from 'express';
import tasksControlller from '../controllers/tasks';
import validate from '../middlewares/validate';
import {
  createTaskSchema,
  getTasksByStatusSchema,
  updateTaskSchema,
  getTaskByIdSchema,
} from '../validators/taskValidators';

const router = Router();

router.post('/', validate({ body: createTaskSchema }), tasksControlller.createTask);
router.get('/', tasksControlller.getAllTasks);
router.get('/:id', validate({ params: getTaskByIdSchema }), tasksControlller.getTaskById);
router.patch(
  '/:id',
  validate({ params: getTaskByIdSchema, body: updateTaskSchema }),
  tasksControlller.updateTask,
);
router.delete('/:id', validate({ params: getTaskByIdSchema }), tasksControlller.deleteTask);
router.get(
  '/status/:status',
  validate({ params: getTasksByStatusSchema }),
  tasksControlller.getTasksByStatus,
);
router.patch(
  '/:id/status',
  validate({ params: getTaskByIdSchema, body: getTasksByStatusSchema }),
  tasksControlller.changeTaskStatus,
);

export default router;
