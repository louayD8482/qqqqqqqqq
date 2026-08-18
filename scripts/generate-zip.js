import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addFilesRecursively(dir, rootDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    // Exclude unwanted folders and files
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === 'dist' ||
      entry.name.endsWith('.zip')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      addFilesRecursively(fullPath, rootDir);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(relPath.replace(/\\/g, '/'), content);
    }
  }
}

async function createZip() {
  console.log('Packing project files with JSZip...');
  addFilesRecursively(process.cwd());

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  fs.writeFileSync('app-complete.zip', content);
  fs.writeFileSync('public/app-complete.zip', content);
  fs.writeFileSync('public/app-complete-ios-android.zip', content);
  fs.writeFileSync('app-complete-ios-android.zip', content);

  console.log('Successfully generated app-complete.zip and public/app-complete.zip');
}

createZip().catch(console.error);
