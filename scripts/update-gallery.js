import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const galleryDir = path.join(rootDir, 'public', 'gallery');
const outputDir = path.join(rootDir, 'public', 'gallery_processed');
const manifestFile = path.join(rootDir, 'src', 'gallery-data.js');

// Dynamically import sharp to support clean error handling if it's missing
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error('Error: "sharp" is not installed. Please run "npm install --save-dev sharp" first.');
  process.exit(1);
}

// Ensure the output directories exist
const thumbDir = path.join(outputDir, 'thumbnails');
const optDir = path.join(outputDir, 'optimized');

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDirExists(outputDir);
ensureDirExists(thumbDir);
ensureDirExists(optDir);

// Allowed image extensions
const imageRegex = /\.(jpe?g|png|webp|gif)$/i;

async function processGallery() {
  console.log('===================================================');
  console.log('   GALLERY OPTIMIZATION PIPELINE');
  console.log('===================================================');
  
  if (!fs.existsSync(galleryDir)) {
    console.log(`Gallery directory not found at: ${galleryDir}`);
    // Create folders just like the powershell script did
    ensureDirExists(galleryDir);
    ensureDirExists(path.join(galleryDir, 'Veterans Memorial Ride 2026'));
    ensureDirExists(path.join(galleryDir, 'Clubhouse Events'));
    ensureDirExists(path.join(galleryDir, 'Spring Charity Poker Run'));
    console.log('Created default gallery directories. Add images and run script again.');
    writeManifest([]);
    return;
  }

  const subdirs = fs.readdirSync(galleryDir).filter(f => {
    const fullPath = path.join(galleryDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  const manifestData = [];

  for (const dirName of subdirs) {
    const dirFullPath = path.join(galleryDir, dirName);
    // Strip leading digits and underscore/hyphen for the visual display name
    const displayName = dirName.replace(/^\d+[_-]/, '');
    
    console.log(`\nScanning folder: "${dirName}" (Display: "${displayName}")`);
    
    // Get all image files in the directory
    const files = fs.readdirSync(dirFullPath).filter(f => {
      const fileFullPath = path.join(dirFullPath, f);
      return fs.statSync(fileFullPath).isFile() && imageRegex.test(f);
    });

    const imageObjects = [];

    // Ensure directory counterparts exist in optimized/thumbnail folders
    const folderThumbDir = path.join(thumbDir, dirName);
    const folderOptDir = path.join(optDir, dirName);
    ensureDirExists(folderThumbDir);
    ensureDirExists(folderOptDir);

    for (const fileName of files) {
      const fileFullPath = path.join(dirFullPath, fileName);
      const ext = path.extname(fileName);
      const baseName = path.basename(fileName, ext);
      const outputName = `${baseName}.webp`; // Convert to modern webp format

      const relOriginalPath = `gallery/${dirName}/${fileName}`;
      const relThumbPath = `gallery_processed/thumbnails/${dirName}/${outputName}`;
      const relOptPath = `gallery_processed/optimized/${dirName}/${outputName}`;

      const fullThumbPath = path.join(folderThumbDir, outputName);
      const fullOptPath = path.join(folderOptDir, outputName);

      // Check if thumbnails already exist to skip repeating heavy work
      let processed = false;
      
      try {
        if (!fs.existsSync(fullThumbPath)) {
          // Generate thumbnail: max 600px width/height, quality 75
          await sharp(fileFullPath)
            .rotate()
            .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 75 })
            .toFile(fullThumbPath);
          processed = true;
        }

        if (!fs.existsSync(fullOptPath)) {
          // Generate optimized preview: max 1920px width/height, quality 82
          await sharp(fileFullPath)
            .rotate()
            .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(fullOptPath);
          processed = true;
        }

        if (processed) {
          const origSizeMb = (fs.statSync(fileFullPath).size / (1024 * 1024)).toFixed(2);
          const thumbSizeKb = (fs.statSync(fullThumbPath).size / 1024).toFixed(1);
          const optSizeMb = (fs.statSync(fullOptPath).size / (1024 * 1024)).toFixed(2);
          console.log(`  ✓ Compressed "${fileName}" (${origSizeMb}MB) -> Opt: ${optSizeMb}MB, Thumb: ${thumbSizeKb}KB`);
        } else {
          console.log(`  - Skipped "${fileName}" (Already optimized)`);
        }

        imageObjects.push({
          original: relOriginalPath,
          thumbnail: relThumbPath,
          optimized: relOptPath
        });

      } catch (err) {
        console.error(`  ✕ Error processing "${fileName}": ${err.message}`);
        // Fallback to original image if processing failed completely
        imageObjects.push({
          original: relOriginalPath,
          thumbnail: relOriginalPath,
          optimized: relOriginalPath
        });
      }
    }

    manifestData.push({
      folderName: displayName,
      images: imageObjects
    });
  }

  writeManifest(manifestData);
  console.log('\n===================================================');
  console.log('Gallery manifests and image compression completed!');
  console.log('===================================================');
}

function writeManifest(data) {
  const content = `export const galleryData = ${JSON.stringify(data)};\n`;
  fs.writeFileSync(manifestFile, content, 'utf8');
  console.log(`Wrote manifest to: ${manifestFile}`);
}

processGallery();
