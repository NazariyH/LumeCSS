const fs = require('fs');
const path = require('path');

// Define the commands you want to add
const newScripts = {
  "lumecss:build": "npm run lumecss:purge-css && npm run lumecss:copy-scripts && npm run lumecss:build-icons",
  "lumecss:purge-css": "postcss node_modules/lumecss/dist/lume.css -o public/main.min.css",
  "lumecss:copy-scripts": "cp node_modules/lumecss/dist/lume.js public/main.min.js",
  "lumecss:build-icons": "mkdir -p public/assets/icons && npx ncp node_modules/lumecss/dist/assets/icons public/assets/icons"
};

// Path to the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');

// Read the existing package.json file
fs.readFile(packageJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading package.json:', err);
    return;
  }

  // Parse the package.json
  let packageJson = JSON.parse(data);

  // Add the new scripts to the package.json
  packageJson.scripts = {
    ...packageJson.scripts,
    ...newScripts
  };

  // Write the modified package.json back to the file
  fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), (err) => {
    if (err) {
      console.error('Error writing package.json:', err);
      return;
    }
    console.log('Successfully added the new scripts to package.json!');
  });
});
