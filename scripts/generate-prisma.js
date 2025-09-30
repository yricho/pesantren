#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Generating Prisma Client...');

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set, using placeholder for build');
    // Set a dummy URL for build time only
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
  }
  
  // Generate Prisma Client
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error.message);
  // Don't fail the build if generation fails
  process.exit(0);
}