import { Router } from 'express';
import tasksControlller from '../controllers/tasks';
import validate from '../middlewares/validate';
import {
  createTaskSchema,
  getTaskByIdSchema,
  getTasksByStatusSchema,
} from '../validators/taskValidators';

const router = Router();

router.post('/', validate({ body: createTaskSchema }), tasksControlller.createTask);
router.get('/', tasksControlller.getAllTasks);
router.get('/:id', validate({ params: getTaskByIdSchema }), tasksControlller.getTaskById);
router.get(
  '/status/:status',
  validate({ params: getTasksByStatusSchema }),
  tasksControlller.getTasksByStatus,
);

export default router;
