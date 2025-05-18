#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { execSync } = require('child_process');

// Parse command-line arguments for output directory
const argv = yargs
  .option('output', {
    alias: 'o',
    description: 'Directory to store the compiled files',
    type: 'string',
    demandOption: true,  // Make sure output directory is provided
  })
  .help()
  .argv;

// Get the custom output directory from the arguments
const outputDir = argv.output;

// Automatically resolve the path to the installed 'lumecss' package in the user's node_modules
let lumecssPath;
try {
  lumecssPath = path.dirname(require.resolve('lumecss/package.json'));
} catch (err) {
  console.error('Error: Could not find "lumecss" package. Please make sure it is installed.');
  process.exit(1);
}

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Purge the CSS using PostCSS and save it in the output directory
console.log(`Purging CSS and saving to ${outputDir}/lumecss.min.css...`);
execSync(`npx postcss ${lumecssPath}/dist/lume.css --config ${lumecssPath}/postcss.config.cjs -o ${outputDir}/lumecss.min.css`, { stdio: 'inherit' });

// 2. Copy the lume.js to the output directory
console.log(`Copying lume.js to ${outputDir}/lumecss.min.js...`);
execSync(`cp ${lumecssPath}/dist/lume.js ${outputDir}/lumecss.min.js`, { stdio: 'inherit' });

// 3. Copy the lumecss icons
const iconsDir = path.join(outputDir, 'assets', 'icons');
const sourceIconsDir = path.join(lumecssPath, 'dist', 'assets', 'icons');

// Ensure the icons directory exists in the output folder
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Copy the icons
console.log(`Copying icons to ${iconsDir}...`);
try {
  const iconFiles = fs.readdirSync(sourceIconsDir);
  iconFiles.forEach((file) => {
    const srcPath = path.join(sourceIconsDir, file);
    const destPath = path.join(iconsDir, file);
    fs.copyFileSync(srcPath, destPath);
  });
} catch (error) {
  console.error('Error during icon copying:', error.message);
  process.exit(1);
}

console.log('LumeCSS build completed successfully!');
