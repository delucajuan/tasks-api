import { Router } from 'express';
import tasksController from '../controllers/tasks';
import validate from '../middlewares/validate';
import {
  createTaskSchema,
  getTasksByStatusSchema,
  updateTaskSchema,
  getTaskByIdSchema,
} from '../validators/taskValidators';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API for managing tasks
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       description: Task object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputResponse'
 */
router.post('/', validate({ body: createTaskSchema }), tasksController.createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve a list of all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *               example:
 *               - id: 1
 *                 title: "Buy groceries"
 *                 description: "Milk, Bread, Eggs"
 *                 status: "pending"
 *                 createdAt: "2023-09-28T12:34:56Z"
 *                 updatedAt: "2023-09-28T12:34:56Z"
 *               - id: 2
 *                 title: "Finish project report"
 *                 description: "Complete the final report by Friday"
 *                 status: "in-progress"
 *                 createdAt: "2023-09-29T10:15:00Z"
 *                 updatedAt: "2023-09-29T10:15:00Z"
 */
router.get('/', tasksController.getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.get('/:id', validate({ params: getTaskByIdSchema }), tasksController.getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       description: Task object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *             - id: 1
 *               title: "Buy groceries and fruits"
 *               description: "Milk, Bread, Eggs, Apples"
 *               status: "pending"
 *               createdAt: "2023-09-28T12:34:56Z"
 *               updatedAt: "2023-09-29T08:21:30Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.patch(
  '/:id',
  validate({ params: getTaskByIdSchema, body: updateTaskSchema }),
  tasksController.updateTask,
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: 200
 *               message: 'Task successfully deleted'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.delete('/:id', validate({ params: getTaskByIdSchema }), tasksController.deleteTask);

/**
 * @swagger
 * /api/tasks/status/{status}:
 *   get:
 *     summary: Get tasks by status
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/StatusParam'
 *     responses:
 *       200:
 *         description: A list of tasks filtered by status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *               example:
 *               - id: 3
 *                 title: "Submit tax returns"
 *                 description: "Submit before the end of the month"
 *                 status: "completed"
 *                 createdAt: "2023-09-20T09:00:00Z"
 *                 updatedAt: "2023-09-25T16:45:00Z"
 *               - id: 4
 *                 title: "Renew car insurance"
 *                 description: "Due next week"
 *                 status: "completed"
 *                 createdAt: "2023-09-22T11:30:00Z"
 *                 updatedAt: "2023-09-28T14:00:00Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputResponse'
 *             example:
 *              status: 400
 *              message: "Bad request"
 *              cause: ["\"status\" must be one of [pending, in-progress, completed, deleted]"]
 */
router.get(
  '/status/:status',
  validate({ params: getTasksByStatusSchema }),
  tasksController.getTasksByStatus,
);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Change the status of a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       description: New status for the task
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeTaskStatusInput'
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *             - id: 1
 *               title: "Buy groceries"
 *               description: "Milk, Bread, Eggs"
 *               status: "completed"
 *               createdAt: "2023-09-28T12:34:56Z"
 *               updatedAt: "2023-09-29T08:21:30Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.patch(
  '/:id/status',
  validate({ params: getTaskByIdSchema, body: getTasksByStatusSchema }),
  tasksController.changeTaskStatus,
);

/**
 * @swagger
 * /api/tasks/{id}/days-elapsed:
 *   get:
 *     summary: Get the number of days elapsed since the task was created
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Days elapsed since task creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 daysElapsed:
 *                   type: integer
 *                   description: Number of days elapsed
 *             example:
 *               daysElapsed : 7
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.get(
  '/:id/days-elapsed',
  validate({ params: getTaskByIdSchema }),
  tasksController.getDaysElapsed,
);

export default router;
