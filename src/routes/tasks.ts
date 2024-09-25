import { Router } from 'express';
import tasksControlller from '../controllers/tasks';
import validate from '../middlewares/validate';
import {
  createTaskSchema,
  idSchema,
  getTasksByStatusSchema,
  updateTaskSchema,
} from '../validators/taskValidators';

const router = Router();

router.post('/', validate({ body: createTaskSchema }), tasksControlller.createTask);
router.get('/', tasksControlller.getAllTasks);
router.get('/:id', validate({ params: idSchema }), tasksControlller.getTaskById);
router.patch(
  '/:id',
  validate({ params: idSchema, body: updateTaskSchema }),
  tasksControlller.updateTask,
);
router.delete('/:id', validate({ params: idSchema }), tasksControlller.deleteTask);
router.get(
  '/status/:status',
  validate({ params: getTasksByStatusSchema }),
  tasksControlller.getTasksByStatus,
);

export default router;
