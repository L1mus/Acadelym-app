import { Router } from 'express';
import { apiLimiter } from '../middlewares/security.js';
import { pool } from '../config/database.js';
import authRoutes from './auth.js';
import courseRoutes from './course.js';


const router = Router();

// Health check endpoint - no rate limit, untuk monitoring
router.get('/health', async (_req, res) => {
    try {
        // Check database connection
        const dbCheck = await pool.query('SELECT NOW()');

        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            services: {
                api: 'operational',
                database: dbCheck.rows ? 'operational' : 'down'
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            services: {
                api: 'operational',
                database: 'down'
            }
        });
    }
});

// API info - dengan rate limiting
router.get('/', apiLimiter, (_req, res) => {
    res.json({
        message: 'Welcome to the API',
        version: '1.0.0',
        documentation: '/api/docs', // TODO: Setup Swagger/OpenAPI
        endpoints: {
            health: 'GET /api/health',
            "auth/login": 'POST /api/auth/login',
            "auth/register": 'POST /api/auth/register',
            // Tambahkan endpoints lainnya di sini
        },
        security: {
            authentication: 'JWT Bearer Token',
            rateLimit: 'Active'
        }
    });
});

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes)

// TODO: Import dan gunakan route modules
// import userRoutes from './users.js';
// router.use('/users', authenticate, userRoutes);

export default router;