import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const monorepoRoot = path.resolve(__dirname, '../../..');
const templatePath = path.resolve(__dirname, '../template');

const ignoreList = [
  'node_modules',
  'dist',
  '.git',
  '.turbo',
  'package-lock.json',
  'packages/create-croissant',
  '.github/workflows/ci.yml', // Don't include the CI in the scaffolded project
];

const includeList = [
  'apps/mobile',
  'apps/web',
  'apps/platform',
];

async function prepareTemplate() {
  console.log('Preparing template for create-croissant...');

  // Remove existing template
  await fs.remove(templatePath);
  await fs.ensureDir(templatePath);

  // Get all items in the root directory
  const rootItems = await fs.readdir(monorepoRoot);

  for (const item of rootItems) {
    const srcPath = path.resolve(monorepoRoot, item);
    const destPath = path.resolve(templatePath, item);

    // Skip ignored items
    if (ignoreList.some(ignore => item === ignore || item.startsWith(ignore + '/'))) {
      continue;
    }

    // Special handling for 'packages' to avoid circular copy
    if (item === 'packages') {
      await fs.ensureDir(destPath);
      const packageItems = await fs.readdir(srcPath);
      for (const pkg of packageItems) {
        if (pkg === 'create-croissant') continue;
        await fs.copy(path.resolve(srcPath, pkg), path.resolve(destPath, pkg), {
          dereference: true,
          filter: (src) => {
            const relativePath = path.relative(monorepoRoot, src);
            return !ignoreList.some(ignore => relativePath.startsWith(ignore));
          }
        });
      }
      continue;
    }

    // Special handling for 'apps' to ensure we include all apps (including mobile)
    if (item === 'apps') {
      await fs.ensureDir(destPath);
      const appItems = await fs.readdir(srcPath);
      for (const app of appItems) {
        const appSrcPath = path.resolve(srcPath, app);
        const appDestPath = path.resolve(destPath, app);
        
        await fs.copy(appSrcPath, appDestPath, {
          dereference: true,
          filter: (src) => {
            const relativePath = path.relative(monorepoRoot, src);
            return !ignoreList.some(ignore => relativePath.startsWith(ignore));
          }
        });
      }
      continue;
    }

    try {
      await fs.copy(srcPath, destPath, {
        dereference: true,
        filter: (src) => {
          const relativePath = path.relative(monorepoRoot, src);
          return !ignoreList.some(ignore => relativePath.startsWith(ignore));
        }
      });
    } catch (err) {
      console.warn(`Warning: Could not copy ${item}: ${err.message}`);
    }
  }

  console.log('Template prepared successfully!');
}

prepareTemplate().catch(err => {
  console.error('Failed to prepare template:', err);
  process.exit(1);
});
