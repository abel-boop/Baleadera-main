import { readdirSync, renameSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const roundsDir = join(__dirname, '../public/images/memories');

// Process each round directory
readdirSync(roundsDir).forEach(roundDir => {
  const roundPath = join(roundsDir, roundDir);
  if (statSync(roundPath).isDirectory()) {
    let counter = 1;
    
    readdirSync(roundPath).forEach((file) => {
      const oldPath = join(roundPath, file);
      const ext = extname(file);
      const newName = `image-${String(counter).padStart(2, '0')}${ext}`;
      const newPath = join(roundPath, newName);
      
      try {
        renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} → ${newName}`);
        counter++;
      } catch (err) {
        console.error(`Error renaming ${file}:`, err);
      }
    });
  }
});

console.log('All images have been renamed!');
