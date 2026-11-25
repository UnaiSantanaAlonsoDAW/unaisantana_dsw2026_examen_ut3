
import express from 'express';
import type { Application } from 'express';

import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import { notFound } from './middlewares/notFound.js';
import { requestId } from './middlewares/requestId.js';

import { documentsRouter } from './routes/documentsRouter.js';
import { healthRouter } from './routes/health.js';
import { questionsRouter } from './routes/questions.js';
import { noticesRouter } from './routes/notices.js';

export function createApp(): Application {
  const app = express();

  // Middlewares: se ejecutan en este orden
  app.use(requestId);
  app.use(logger);
  app.use(express.json());

  // Rutas de Connectia
  app.use('/health', healthRouter);
  app.use('/api/v1/admin/documents', documentsRouter);
  app.use('/api/v1/questions', questionsRouter);
  app.use('/api/v1/notices', noticesRouter)

  // Ruta de prueba que ya teníamos
  app.get('/test/:team', (req, res) => {
    const { team } = req.params;
    res.status(200).json({ team });
  });

  // Manejadores de errores: siempre después de las rutas
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
