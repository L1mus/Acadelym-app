import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/database.js';


const startServer = async () => {
    try {
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('Database connected successfully');

        const server = app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`);
            console.log(`Environment: ${env.NODE_ENV}`);
            console.log(`API: http://localhost:${env.PORT}/api`);
        });

        // Graceful shutdown
        const shutdown = async () => {
            console.log('\nShutting down gracefully...');
            server.close(async () => {
                await pool.end();
                console.log('Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();