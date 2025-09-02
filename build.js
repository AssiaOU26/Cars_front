#!/usr/bin/env node

/**
 * Railway-compatible build script
 * 
 * This script handles the platform-specific rollup dependency issue by:
 * - On Windows: Installing all dependencies including Windows-specific packages for development
 * - On Linux (Railway): Installing dependencies with --omit=optional to skip platform-specific packages
 * 
 * This solves the npm bug: https://github.com/npm/cli/issues/4828
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Railway-compatible build process...');

// Check if we're on Windows
const isWindows = process.platform === 'win32';

if (isWindows) {
    console.log('📦 Windows detected - using full npm install');
    // On Windows, we need the Windows-specific packages for development
    try {
        execSync('npm install', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ npm install failed:', error.message);
        process.exit(1);
    }
} else {
    console.log('🐧 Linux detected - using npm install --omit=optional');
    // On Linux (Railway), we skip optional dependencies
    try {
        execSync('npm install --omit=optional', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ npm install --omit=optional failed:', error.message);
        process.exit(1);
    }
}

console.log('🔨 Building application...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
