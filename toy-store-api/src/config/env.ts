import { z } from 'zod';

// Schema para validação das variáveis de ambiente
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  
  // Server
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

// Função para validar e carregar as variáveis de ambiente
function loadEnvConfig() {
  try {
    const envVars = envSchema.parse(process.env);
    
    return {
      database: {
        url: envVars.DATABASE_URL,
      },
      jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_EXPIRES_IN,
      },
      server: {
        port: parseInt(envVars.PORT, 10),
        nodeEnv: envVars.NODE_ENV,
      },
      cors: {
        allowedOrigins: envVars.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
      },
      rateLimit: {
        windowMs: parseInt(envVars.RATE_LIMIT_WINDOW_MS, 10),
        maxRequests: parseInt(envVars.RATE_LIMIT_MAX_REQUESTS, 10),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro na validação das variáveis de ambiente:');
      (error as any).errors.forEach((err: any) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    
    console.error('❌ Erro inesperado ao carregar configurações:', error);
    process.exit(1);
  }
}

// Carrega e valida as configurações
export const config = loadEnvConfig();

// Tipos exportados para uso em outros arquivos
export type Config = typeof config;

// Função para verificar se está em desenvolvimento
export const isDevelopment = config.server.nodeEnv === 'development';

// Função para verificar se está em produção
export const isProduction = config.server.nodeEnv === 'production';

// Função para verificar se está em teste
export const isTest = config.server.nodeEnv === 'test'; 