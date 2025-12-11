export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-change-this',
  jwtExpiration: '24h',
  jwtRefreshExpiration: '7d',
  bcryptRounds: 12,
  otpExpiration: 300, // 5 minutes in seconds
  maxLoginAttempts: 5,
  lockoutDuration: 900, // 15 minutes in seconds
};

export const appConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};

export const dbConfig = {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

export const emailConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || 'noreply@bizmanage.lk',
};

export const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin123',
  bucketName: process.env.MINIO_BUCKET_NAME || 'bizmanage-files',
};

export const backupConfig = {
  schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  googleDriveClientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
  googleDriveClientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  googleDriveRefreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
};