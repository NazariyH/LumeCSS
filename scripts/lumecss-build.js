#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const yargs = require('yargs');
const postcss = require('postcss');

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
const outputDir = path.resolve(argv.output);

// Resolve lumecss package path
let lumecssPath;
try {
  lumecssPath = path.dirname(require.resolve('lumecss/package.json'));
} catch {
  console.error('Error: Could not find "lumecss" package. Please install it.');
  process.exit(1);
}

// Ensure necessary directories exist
fs.mkdirSync(outputDir, { recursive: true });
const iconsDestDir = path.join(outputDir, 'assets', 'icons');
fs.mkdirSync(iconsDestDir, { recursive: true });

// Always purge and compile CSS using PostCSS Node API
(async () => {
  try {
    const cssInputPath = path.join(lumecssPath, 'dist', 'lume.css');
    const cssOutputPath = path.join(outputDir, 'lumecss.min.css');
    const cssInput = await fsp.readFile(cssInputPath, 'utf8');

    const postcssConfig = require(path.join(lumecssPath, 'postcss.config.cjs'));
    const result = await postcss(postcssConfig.plugins).process(cssInput, {
      from: undefined,
    });

    await fsp.writeFile(cssOutputPath, result.css);
  } catch (err) {
    console.error('Error during CSS processing:', err.message);
    process.exit(1);
  }

  // Copy JS (force overwrite)
  try {
    const jsSrc = path.join(lumecssPath, 'dist', 'lume.js');
    const jsDest = path.join(outputDir, 'lumecss.min.js');
    fs.copyFileSync(jsSrc, jsDest);
  } catch (err) {
    console.error('Error copying JS file:', err.message);
    process.exit(1);
  }

  // Copy icons in parallel
  try {
    const iconsSrcDir = path.join(lumecssPath, 'dist', 'assets', 'icons');
    const iconFiles = await fsp.readdir(iconsSrcDir);

    await Promise.all(iconFiles.map(file => {
      const src = path.join(iconsSrcDir, file);
      const dest = path.join(iconsDestDir, file);
      return fsp.copyFile(src, dest);
    }));
  } catch (err) {
    console.error('Error copying icons:', err.message);
    process.exit(1);
  }

  // Done
  const end = Date.now();
  console.log(`LumeCSS build: ${((end - start) / 1000).toFixed(3)}s`);
})();
