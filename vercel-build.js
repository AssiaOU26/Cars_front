#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build...');

try {
    console.log('🔨 Building application...');
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}