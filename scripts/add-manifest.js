// scripts/add-manifest.js
const fs = require('fs');
const path = require('path');

// Paths
const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const manifestPath = path.join(distPath, 'manifest.json');

// Read the index.html file
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Check if manifest already exists
  if (data.includes('manifest.json')) {
    console.log('Manifest already exists in index.html');
    return;
  }

  // Add manifest link and theme color before the closing head tag
  const manifestLink = `
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#ECFE72" />
    <link rel="apple-touch-icon" href="/icons/motivacion-128.png" />
     `;

  const appleMetaTags = `
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Macros">
  
  <link rel="apple-touch-icon" href="/icons/motivacion-128.png">
  <link rel="apple-touch-startup-image" href="/icons/motivacion-128.png">
  
  <link rel="mask-icon" href="/icons/motivacion-128.png" color="#ECFE72">
  <meta name="description" content="Controla tus macros y calorías diarias">
  `;

  // Insert the manifest link before the closing head tag
  const updatedHtml = data.replace('</head>', `${manifestLink}${appleMetaTags}</head>`);

  // Write the updated content back to index.html
  fs.writeFile(indexPath, updatedHtml, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to index.html:', err);
      return;
    }
    console.log('✅ Successfully added manifest to index.html');
  });
});

// Copy manifest.json to dist if it doesn't exist
if (!fs.existsSync(manifestPath)) {
  const publicManifestPath = path.join(__dirname, '../public/manifest.json');
  if (fs.existsSync(publicManifestPath)) {
    fs.copyFile(publicManifestPath, manifestPath, (err) => {
      if (err) {
        console.error('Error copying manifest.json:', err);
        return;
      }
      console.log('✅ Successfully copied manifest.json to dist folder');
    });
  }
}
