import { Router } from 'express';
import tasksControlller from '../controllers/tasks';
import validate from '../middlewares/validate';
import { createTaskSchema } from '../validators/taskValidators';

const router = Router();

router.post('/', validate(createTaskSchema), tasksControlller.createTask);
router.get('/', tasksControlller.getAllTasks);

export default router;
