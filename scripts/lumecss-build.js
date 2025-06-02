#!/usr/bin/env node

// Core modules
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { execSync } = require('child_process');

// Start timer
const start = Date.now();

// Parse CLI args
const argv = yargs
  .option('output', {
    alias: 'o',
    description: 'Directory to store the compiled files',
    type: 'string',
    demandOption: true,
  })
  .help()
  .argv;

// Output directory
const outputDir = argv.output;

// Resolve lumecss package path
let lumecssPath;
try {
  lumecssPath = path.dirname(require.resolve('lumecss/package.json'));
} catch (err) {
  console.error('Error: Could not find "lumecss" package. Please install it.');
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process CSS
const cssOutput = path.join(outputDir, 'lumecss.min.css');
if (!fs.existsSync(cssOutput)) {
  try {
    execSync(`npx postcss ${lumecssPath}/dist/lume.css --config ${lumecssPath}/postcss.config.cjs -o ${cssOutput}`, {
      stdio: 'ignore',
    });
  } catch (err) {
    console.error('Error during CSS compilation:', err.message);
    process.exit(1);
  }
}

// Copy JS
const jsOutput = path.join(outputDir, 'lumecss.min.js');
if (!fs.existsSync(jsOutput)) {
  try {
    execSync(`cp ${lumecssPath}/dist/lume.js ${jsOutput}`, {
      stdio: 'ignore',
    });
  } catch (err) {
    console.error('Error copying JS file:', err.message);
    process.exit(1);
  }
}

// Copy icons
const sourceIconsDir = path.join(lumecssPath, 'dist', 'assets', 'icons');
const destIconsDir = path.join(outputDir, 'assets', 'icons');

if (!fs.existsSync(destIconsDir)) {
  fs.mkdirSync(destIconsDir, { recursive: true });
}

const sourceIcons = fs.readdirSync(sourceIconsDir);
const destIcons = fs.existsSync(destIconsDir) ? fs.readdirSync(destIconsDir) : [];

const iconsNeedCopying = sourceIcons.some(icon => !destIcons.includes(icon));
if (iconsNeedCopying) {
  try {
    sourceIcons.forEach(file => {
      const srcPath = path.join(sourceIconsDir, file);
      const destPath = path.join(destIconsDir, file);
      fs.copyFileSync(srcPath, destPath);
    });
  } catch (err) {
    console.error('Error copying icon files:', err.message);
    process.exit(1);
  }
}

// End timer and log minimal success message
const end = Date.now();
console.log(`LumeCSS build: ${((end - start) / 1000).toFixed(3)}s`);
