import 'reflect-metadata';
import { config } from 'dotenv';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { typeDefs } from './types/graphql';
import { userResolvers } from './resolvers/userResolvers';
import { initializeDatabase, closeDatabase } from './database/config';

// Load environment variables
config();

/**
 * Main application class for the Moonshot User Service
 * Handles Apollo Server setup, Express configuration, and graceful shutdown
 */
class MoonshotUserService {
  private app: express.Application;
  private server: ApolloServer;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '4000');
    this.server = new ApolloServer({
      typeDefs,
      resolvers: userResolvers,
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [
        // Custom plugin for logging
        {
          async requestDidStart() {
            return {
              async didResolveOperation(requestContext: any) {
                console.log(`🔍 GraphQL Operation: ${requestContext.request.operationName}`);
              },
              async didEncounterErrors(requestContext: any) {
                console.error('❌ GraphQL Errors:', requestContext.errors);
              }
            };
          }
        }
      ]
    });
  }

  /**
   * Configure Express middleware
   */
  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com'] 
        : ['http://localhost:3000'],
      credentials: true
    }));

    // Compression middleware
    this.app.use(compression());

    // JSON parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Health check endpoint
    this.app.get('/health', (req: express.Request, res: express.Response) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Root endpoint
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'Moonshot User Management Service',
        version: '1.0.0',
        graphql: '/graphql',
        health: '/health'
      });
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    try {
      // Initialize database connection
      await initializeDatabase();

      // Configure middleware
      this.configureMiddleware();

      // Start Apollo Server
      await this.server.start();

      // Apply Apollo GraphQL middleware
      this.app.use('/graphql', expressMiddleware(this.server, {
        context: async ({ req, res }) => ({ req, res })
      }));

      // Start HTTP server
      const httpServer = this.app.listen(this.port, () => {
        console.log(`🚀 Server ready at http://localhost:${this.port}`);
        console.log(`🎯 GraphQL endpoint: http://localhost:${this.port}/graphql`);
        console.log(`💚 Health check: http://localhost:${this.port}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });

      // Graceful shutdown handling
      this.setupGracefulShutdown(httpServer);

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupGracefulShutdown(httpServer: any): void {
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      try {
        // Stop accepting new connections
        httpServer.close(() => {
          console.log('✅ HTTP server closed');
        });

        // Stop Apollo Server
        await this.server.stop();
        console.log('✅ Apollo Server stopped');

        // Close database connection
        await closeDatabase();

        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Handle different termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
  }
}

/**
 * Start the application
 */
const startApplication = async (): Promise<void> => {
  const service = new MoonshotUserService();
  await service.start();
};

// Start the server if this file is run directly
if (require.main === module) {
  startApplication().catch((error: Error) => {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  });
}

export default MoonshotUserService; 