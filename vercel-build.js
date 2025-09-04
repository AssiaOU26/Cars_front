#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build...');

try {
    // Force install the correct rollup binary for the platform
    console.log('📦 Installing platform-specific rollup binary...');

    // Check if we're on Linux (Vercel) or Windows
    const isLinux = process.platform === 'linux';

    if (isLinux) {
        // On Linux (Vercel), install the Linux rollup binary
        execSync('npm install @rollup/rollup-linux-x64-gnu --save-dev', { stdio: 'inherit' });
    } else {
        // On Windows, install the Windows rollup binary
        execSync('npm install @rollup/rollup-win32-x64-msvc --save-dev', { stdio: 'inherit' });
    }

    console.log('🔨 Building application...');
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}