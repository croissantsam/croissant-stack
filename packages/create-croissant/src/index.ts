#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('create-croissant')
  .description('Scaffold a new project using the Croissant Stack')
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName) => {
    console.log(chalk.bold.yellow('\n🥐 Welcome to the Croissant Stack!\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your project named?',
        default: projectName || 'my-croissant-app',
        when: !projectName,
      },
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to install dependencies?',
        default: true,
      },
    ]);

    const finalProjectName = projectName || answers.name;
    const projectPath = path.resolve(process.cwd(), finalProjectName);

    if (fs.existsSync(projectPath)) {
      console.error(chalk.red(`\nError: Directory ${finalProjectName} already exists.\n`));
      process.exit(1);
    }

    const spinner = ora('Scaffolding your project...').start();

    try {
      // Create project directory
      await fs.ensureDir(projectPath);

      // Copy template files (this will be from the package's template directory when published)
      // For local development, we'd need to handle where the template is.
      // Assuming 'template' directory exists in the package.
      const templatePath = path.join(__dirname, '..', 'template');
      
      if (await fs.pathExists(templatePath)) {
        await fs.copy(templatePath, projectPath);
      } else {
        // Fallback for development: use the current monorepo as template but exclude certain files
        const monorepoRoot = path.resolve(__dirname, '../../..');
        const ignoreList = [
          'node_modules',
          'dist',
          '.git',
          'packages/create-croissant',
          '.turbo',
          'package-lock.json',
        ];
        
        await fs.copy(monorepoRoot, projectPath, {
          filter: (src: string) => {
            const relativePath = path.relative(monorepoRoot, src);
            return !ignoreList.some(ignore => relativePath.startsWith(ignore));
          }
        });
      }

      // Customize package.json
      const pkgJsonPath = path.join(projectPath, 'package.json');
      if (await fs.pathExists(pkgJsonPath)) {
        const pkgJson = await fs.readJson(pkgJsonPath);
        pkgJson.name = finalProjectName;
        pkgJson.version = '0.1.0';
        delete pkgJson.private; // Make it non-private for the user
        await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
      }

      spinner.succeed(chalk.green(`Project ${finalProjectName} created at ${projectPath}`));

      if (answers.install) {
        const installSpinner = ora('Installing dependencies...').start();
        try {
          await execa('npm', ['install'], { cwd: projectPath });
          installSpinner.succeed(chalk.green('Dependencies installed!'));
        } catch (err) {
          installSpinner.fail(chalk.red('Failed to install dependencies. You may need to run npm install manually.'));
        }
      }

      console.log(chalk.bold.cyan('\nNext steps:'));
      console.log(`  cd ${finalProjectName}`);
      console.log('  npm run db:up    # Start your PostgreSQL database');
      console.log('  npm run dev      # Start development server\n');
      console.log(chalk.yellow('Happy hacking! 🥐\n'));

    } catch (error) {
      spinner.fail(chalk.red('An error occurred during scaffolding.'));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
