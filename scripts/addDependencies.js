const fs = require('fs');
const path = require('path');

// Define the dependencies you want to add
const newDependencies = {
  "@fullhuman/postcss-purgecss": "^7.0.2",
  "postcss": "^8.5.3",
  "ncp": "^2.0.0",
  "postcss-cli": "^11.0.1",
  "postcss-preset-env": "^10.1.6",
  "purgecss": "^7.0.2",
  "sass": "^1.88.0",
  "sass-loader": "^16.0.5",
  "ts-loader": "^9.5.2",
  "typescript": "^5.8.3"
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

  // Ensure the dependencies and devDependencies sections exist
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  // Add the new dependencies to the respective sections
  Object.keys(newDependencies).forEach(dep => {
    if (dep.startsWith('typescript') || dep.startsWith('ts-')) {
      // Add to devDependencies if it's a TypeScript-related package
      packageJson.devDependencies[dep] = newDependencies[dep];
    } else {
      // Add to dependencies if it's not TypeScript-related
      packageJson.dependencies[dep] = newDependencies[dep];
    }
  });

  // Write the modified package.json back to the file
  fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), (err) => {
    if (err) {
      console.error('Error writing package.json:', err);
      return;
    }
    console.log('Successfully added the new dependencies to package.json!');
  });
});
