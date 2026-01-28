import express from 'express';
import { securityHeaders, corsOptions, limiter } from './middlewares/security.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import {logRequest} from "./middlewares/logging.js";
import router from './routes/index.js';

const app = express();


// Security & Parsing
app.use(securityHeaders);
app.use(corsOptions);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(limiter);

// Trust proxy (untuk production di balik reverse proxy)
app.set('trust proxy', 1);

app.use(logRequest)

// Routes
app.use('/api', router);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;