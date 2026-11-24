const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src');
const output = path.join(root, 'dist');

// Only generated files belong here; never modify the source tree during a build.
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.copyFileSync(path.join(source, 'index.html'), path.join(output, 'index.html'));
for (const file of fs.readdirSync(path.join(source, 'pages'))) {
  if (file.endsWith('.html')) {
    // Flatten pages to preserve the existing public /about.html, /works.html, etc.
    fs.copyFileSync(path.join(source, 'pages', file), path.join(output, file));
  }
}
fs.cpSync(path.join(source, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log('Built static website in dist/');
