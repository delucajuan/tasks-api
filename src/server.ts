import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import morgan from 'morgan';
import { HttpError } from './types/types';
import setupSwaggerDocs from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger Docs
setupSwaggerDocs(app);

// Morgan
app.use(morgan('dev'));

// Use Routes
app.use('/api', routes);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: HttpError = new Error(`Not Found - ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// Error handler
app.use(errorHandler);

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');

    app.listen(PORT, () => {
      console.log(`✅ | Server is running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => console.error('TypeORM connection error: ', error));
