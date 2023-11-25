// File: createComponentFiles.js
const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

const componentDir = // get the folder I have selected in vscode
    // Log a message
    console.log(`Creating component files for: ${componentName}`);
console.log(`Target directory: ${componentDir}`);

// Get the absolute path of the directory above the script
const scriptParentDir = path.join(__dirname, '../');

// Read the template files
const componentTemplatePath = path.join(
    scriptParentDir,
    'templates/componentTemplate.tsx'
);
const indexTemplatePath = path.join(
    scriptParentDir,
    'templates/indexTemplate.ts'
);

// Read the template files
const componentTemplate = fs.readFileSync(componentTemplatePath, 'utf8');
const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf8');

// Replace the placeholder with the actual component name
const componentContent = componentTemplate.replace(
    /__COMPONENT_NAME__/g,
    componentName
);
const indexContent = indexTemplate.replace(
    /__COMPONENT_NAME__/g,
    componentName
);

// Create the .tsx file
fs.writeFileSync(
    path.join(componentDir, `${componentName}.tsx`),
    componentContent
);

// Create the index.ts file
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent);
