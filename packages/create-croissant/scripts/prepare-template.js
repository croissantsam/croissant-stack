import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const monorepoRoot = path.resolve(__dirname, "../../..");
const templatePath = path.resolve(__dirname, "../template");

const ignoreList = [
  "node_modules",
  "dist",
  ".git",
  ".turbo",
  ".expo",
  ".output",
  ".nitro",
  ".tanstack",
  ".vinxi",
  "package-lock.json",
  "pnpm-lock.yaml",
  "packages/create-croissant",
  ".github",
  ".husky",
];

function shouldIgnore(src) {
  const relativePath = path.relative(monorepoRoot, src);
  const parts = relativePath.split(path.sep);
  return ignoreList.some((ignore) => parts.includes(ignore));
}

async function retryRemove(targetPath, retries = 5, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.remove(targetPath);
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} removing ${targetPath} due to error: ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// const includeList = ["apps/mobile", "apps/web", "apps/platform", "apps/desktop"];

async function prepareTemplate() {
  console.log("Preparing template for create-croissant...");

  // Remove existing template
  await retryRemove(templatePath);
  await fs.ensureDir(templatePath);

  // Get all items in the root directory
  const rootItems = await fs.readdir(monorepoRoot);

  for (const item of rootItems) {
    const srcPath = path.resolve(monorepoRoot, item);
    const destPath = path.resolve(templatePath, item);

    // Skip ignored items
    if (shouldIgnore(srcPath)) {
      continue;
    }

    // Special handling for 'packages' to avoid circular copy
    if (item === "packages") {
      await fs.ensureDir(destPath);
      const packageItems = await fs.readdir(srcPath);
      for (const pkg of packageItems) {
        if (pkg === "create-croissant") continue;
        await fs.copy(path.resolve(srcPath, pkg), path.resolve(destPath, pkg), {
          dereference: true,
          filter: (src) => !shouldIgnore(src),
        });
      }
      continue;
    }

    // Special handling for 'apps' to ensure we include all apps (including mobile)
    if (item === "apps") {
      await fs.ensureDir(destPath);
      const appItems = await fs.readdir(srcPath);
      for (const app of appItems) {
        const appSrcPath = path.resolve(srcPath, app);
        const appDestPath = path.resolve(destPath, app);

        await fs.copy(appSrcPath, appDestPath, {
          dereference: true,
          filter: (src) => !shouldIgnore(src),
        });
      }
      continue;
    }

    try {
      await fs.copy(srcPath, destPath, {
        dereference: true,
        filter: (src) => !shouldIgnore(src),
      });
    } catch (err) {
      console.warn(`Warning: Could not copy ${item}: ${err.message}`);
    }
  }

  console.log("Template prepared successfully!");

  // Clean up Expo integration from the template's backend auth
  // This ensures the template is "clean" by default, and the CLI script handles the integration
  console.log("Cleaning up Expo integration from template...");
  const authLibPath = path.resolve(templatePath, "packages/auth/src/lib/auth.ts");
  if (await fs.pathExists(authLibPath)) {
    let authContent = await fs.readFile(authLibPath, "utf8");
    authContent = authContent.replace(/import \{ expo \} from "@better-auth\/expo";\n/, "");
    authContent = authContent.replace(/\s+plugins: \[expo\(\)\],/, "");
    authContent = authContent.replace(/\s+trustedOrigins: \[[\s\S]*?\],/, "");
    await fs.writeFile(authLibPath, authContent);
  }

  const authPkgPath = path.resolve(templatePath, "packages/auth/package.json");
  if (await fs.pathExists(authPkgPath)) {
    const authPkg = await fs.readJson(authPkgPath);
    if (authPkg.dependencies && authPkg.dependencies["@better-auth/expo"]) {
      delete authPkg.dependencies["@better-auth/expo"];
      await fs.writeJson(authPkgPath, authPkg, { spaces: 2 });
    }
  }
}

prepareTemplate().catch((err) => {
  console.error("Failed to prepare template:", err);
  process.exit(1);
});
