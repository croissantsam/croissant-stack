#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { Command } from "commander";
import { execa } from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name("croissant-add")
  .description("Add a mobile app to an existing Croissant Stack project")
  .action(async () => {
    console.log(chalk.bold.yellow("\n🥐 Croissant Stack: Add App\n"));

    // Check if we are in a Croissant project
    const rootPkgPath = path.join(process.cwd(), "package.json");
    if (!(await fs.pathExists(rootPkgPath))) {
      console.error(chalk.red("\nError: package.json not found. Are you in the root of your project?\n"));
      process.exit(1);
    }

    const rootPkg = await fs.readJson(rootPkgPath);
    // Simple check if it's a croissant project (could be more robust)
    if (!rootPkg.scripts || (!rootPkg.scripts.dev && !rootPkg.scripts.build)) {
      console.error(chalk.red("\nError: This doesn't look like a Croissant Stack project.\n"));
      process.exit(1);
    }

    const mobilePath = path.join(process.cwd(), "apps/mobile");
    const mobileExists = await fs.pathExists(mobilePath);

    if (mobileExists) {
      console.log(chalk.blue("Mobile app is already present. Nothing to add!\n"));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Would you like to add the Mobile App (Expo)?",
        default: true,
      },
    ]);

    if (!confirm) return;

    const projectPath = process.cwd();
    const spinner = ora(`Adding mobile app...`).start();

    try {
      // Find template path (local dev or published)
      let templatePath = path.join(__dirname, "..", "template");
      if (!(await fs.pathExists(templatePath))) {
        // Fallback for development: use monorepo if template dir doesn't exist yet
        templatePath = path.resolve(__dirname, "../../..");
      }

      const mobileTemplatePath = path.join(templatePath, "apps/mobile");
      await fs.copy(mobileTemplatePath, mobilePath);

      // Add scripts back to root package.json
      rootPkg.scripts = rootPkg.scripts || {};
      rootPkg.scripts["dev:mobile"] = "turbo run dev --filter=mobile";
      rootPkg.scripts["dev:ios"] = "turbo run dev --filter=mobile -- --ios";
      rootPkg.scripts["dev:android"] = "turbo run dev --filter=mobile -- --android";
      rootPkg.scripts["build:mobile"] = "turbo run build --filter=mobile";
      await fs.writeJson(rootPkgPath, rootPkg, { spaces: 2 });

      // Handle Expo integration in backend auth
      const authLibPath = path.join(projectPath, "packages/auth/src/lib/auth.ts");
      if (await fs.pathExists(authLibPath)) {
        let authContent = await fs.readFile(authLibPath, "utf8");

        // Add expo import if missing
        if (!authContent.includes('@better-auth/expo')) {
          authContent = `import { expo } from "@better-auth/expo";\n${authContent}`;
        }

        // Add expo plugin and trustedOrigins if missing
        if (!authContent.includes('plugins: [expo()]')) {
          const expoConfig = `
  plugins: [expo()],
  trustedOrigins: [
    "mobile://",
    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://",
          "exp://**",
          "exp://192.168.*.*:*/**",
          "http://localhost:8081",
        ]
      : []),
  ],`;
          authContent = authContent.replace(
            'emailAndPassword: { enabled: true },',
            `emailAndPassword: { enabled: true },${expoConfig}`,
          );
        }
        await fs.writeFile(authLibPath, authContent);
      }

      // Add @better-auth/expo to packages/auth/package.json
      const authPkgPath = path.join(projectPath, "packages/auth/package.json");
      if (await fs.pathExists(authPkgPath)) {
        const authPkg = await fs.readJson(authPkgPath);
        authPkg.dependencies = authPkg.dependencies || {};
        if (!authPkg.dependencies["@better-auth/expo"]) {
          authPkg.dependencies["@better-auth/expo"] = "latest";
          await fs.writeJson(authPkgPath, authPkg, { spaces: 2 });
        }
      }

      spinner.succeed(chalk.green("Mobile app added successfully!"));

      const { install } = await inquirer.prompt([
        {
          type: "confirm",
          name: "install",
          message: "Would you like to install dependencies now?",
          default: true,
        },
      ]);

      if (install) {
        const installSpinner = ora("Installing dependencies...").start();
        try {
          await execa("pnpm", ["install"], { cwd: projectPath });
          installSpinner.succeed(chalk.green("Dependencies installed!"));
        } catch {
          installSpinner.fail(chalk.red("Failed to install dependencies. Run pnpm install manually."));
        }
      }

      console.log(chalk.bold.cyan("\nNext steps:"));
      console.log("  pnpm run dev:mobile    # Start Expo development server");
      console.log(chalk.yellow("\nHappy hacking! 🥐\n"));

    } catch (error) {
      spinner.fail(chalk.red("An error occurred while adding the mobile app."));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
