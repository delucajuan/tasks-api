import { Router } from 'express';
import { getAllTasks } from '../controllers/taskController';

const router = Router();

router.get('/', getAllTasks);

export default router;
