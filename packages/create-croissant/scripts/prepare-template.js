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

async function prepareTemplate() {
  console.log('Preparing template for create-croissant...');

  // Remove existing template
  await fs.remove(templatePath);
  await fs.ensureDir(templatePath);

  // Copy files
  await fs.copy(monorepoRoot, templatePath, {
    filter: (src) => {
      const relativePath = path.relative(monorepoRoot, src);
      if (!relativePath) return true; // root itself
      return !ignoreList.some(ignore => relativePath.startsWith(ignore));
    }
  });

  console.log('Template prepared successfully!');
}

prepareTemplate().catch(err => {
  console.error('Failed to prepare template:', err);
  process.exit(1);
});
