import { Router } from 'express';
import tasksControlller from '../controllers/tasks';

const router = Router();

router.get('/', tasksControlller.getAllTasks);

export default router;
