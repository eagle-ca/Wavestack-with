/**
 * Root Hosting Entrypoint for Pterodactyl, Docker, VPS, and Cloud Panels.
 * Bootstraps the bot reliably across both production (dist) and development (src),
 * with self-healing automatic package.json generation and dependency verification.
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const EMBEDDED_PACKAGE_JSON = {
  name: "aegis-security-bot",
  version: "1.0.0",
  description: "Advanced Discord Security, Anti-Bypass, Intelligent Moderation & Multipurpose Bot",
  main: "index.js",
  scripts: {
    build: "tsc",
    start: "node index.js",
    dev: "tsx src/index.ts",
    "deploy-commands": "tsx src/deploy.ts",
    test: "tsx tests/security.test.ts && tsx tests/music.test.ts"
  },
  license: "ISC",
  type: "commonjs",
  dependencies: {
    "@discordjs/voice": "^0.19.2",
    "@distube/ytdl-core": "^5.2.0",
    "@types/better-sqlite3": "^9.6.0",
    "@types/ms": "^2.1.0",
    "@types/node": "^26.6.6",
    "better-sqlite3": "^13.0.3",
    "discord.js": "^14.28.0",
    "dotenv": "^18.0.9",
    "ffmpeg-static": "^5.3.0",
    "libsodium-wrappers": "^0.8.4",
    "ms": "^2.1.3",
    "opusscript": "^0.0.8",
    "play-dl": "^1.9.7",
    "tslib": "^2.9.1",
    "tsx": "^4.23.15",
    "typescript": "^7.0.2"
  }
};

function findProjectEntry() {
  // 1. Standalone single-file bundle check (Easiest to upload on hosting panels)
  const rootBundle = path.join(__dirname, 'bundle.js');
  if (fs.existsSync(rootBundle)) return { type: 'bundle', file: rootBundle, dir: __dirname };

  // 2. Direct root compiled dist check
  const rootDist = path.join(__dirname, 'dist', 'index.js');
  if (fs.existsSync(rootDist)) return { type: 'dist', file: rootDist, dir: __dirname };

  // 3. Direct root TypeScript src check
  const rootSrc = path.join(__dirname, 'src', 'index.ts');
  if (fs.existsSync(rootSrc)) return { type: 'src', file: rootSrc, dir: __dirname };

  // 4. Subdirectory search (in case files were uploaded inside a subfolder like MM/ or bot/)
  try {
    const entries = fs.readdirSync(__dirname, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory() && ent.name !== 'node_modules' && !ent.name.startsWith('.')) {
        const subBundle = path.join(__dirname, ent.name, 'bundle.js');
        if (fs.existsSync(subBundle)) {
          return { type: 'bundle', file: subBundle, dir: path.join(__dirname, ent.name) };
        }
        const subDist = path.join(__dirname, ent.name, 'dist', 'index.js');
        if (fs.existsSync(subDist)) {
          return { type: 'dist', file: subDist, dir: path.join(__dirname, ent.name) };
        }
        const subSrc = path.join(__dirname, ent.name, 'src', 'index.ts');
        if (fs.existsSync(subSrc)) {
          return { type: 'src', file: subSrc, dir: path.join(__dirname, ent.name) };
        }
      }
    }
  } catch {}

  return null;
}

function ensureDependencies(targetDir) {
  // 1. Ensure package.json exists (auto-generate if user forgot to upload it)
  const pkgPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.log('[Hosting Boot] package.json was missing! Auto-generating package.json...');
    fs.writeFileSync(pkgPath, JSON.stringify(EMBEDDED_PACKAGE_JSON, null, 2));
    console.log('[Hosting Boot] package.json created successfully.');
  }

  // 2. Ensure .npmrc exists to prevent Node 25 EBADENGINE warnings
  const npmrcPath = path.join(targetDir, '.npmrc');
  if (!fs.existsSync(npmrcPath)) {
    fs.writeFileSync(npmrcPath, 'engine-strict=false\nfund=false\naudit=false\n');
  }

  // 3. Verify core packages can actually be required
  const essential = ['tslib', 'discord.js', 'dotenv', 'better-sqlite3'];
  let needsInstall = false;
  for (const pkg of essential) {
    try {
      require.resolve(pkg, { paths: [targetDir, path.join(targetDir, 'node_modules'), __dirname] });
    } catch {
      needsInstall = true;
      break;
    }
  }

  if (needsInstall) {
    console.log('[Hosting Boot] Installing dependencies via npm install...');
    try {
      execSync('npm install --no-audit --no-fund --engine-strict=false', { stdio: 'inherit', cwd: targetDir });
      console.log('[Hosting Boot] npm install finished successfully!');
    } catch (err) {
      console.warn('[Hosting Boot] Standard install had warnings, attempting targeted install...');
      try {
        execSync('npm install tslib discord.js dotenv better-sqlite3 --no-audit --no-fund --engine-strict=false', { stdio: 'inherit', cwd: targetDir });
        console.log('[Hosting Boot] Targeted dependencies installed successfully!');
      } catch (innerErr) {
        console.error('[Hosting Boot] Dependency install error:', innerErr.message);
      }
    }
  }
}

function loadEnvironment(targetDir) {
  const candidateEnvs = [
    path.join(targetDir, '.env'),
    path.join(__dirname, '.env'),
    path.join(targetDir, '.env.example'),
    path.join(__dirname, '.env.example'),
  ];

  for (const envPath of candidateEnvs) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
            if (key && !process.env[key] && val) {
              process.env[key] = val;
            }
          }
        }
      } catch {}
    }
  }

  // If targetDir/.env doesn't exist or is empty, write populated .env
  const targetEnv = path.join(targetDir, '.env');
  if (process.env.DISCORD_TOKEN) {
    try {
      if (!fs.existsSync(targetEnv) || fs.statSync(targetEnv).size === 0) {
        fs.writeFileSync(
          targetEnv,
          `DISCORD_TOKEN=${process.env.DISCORD_TOKEN}\nCLIENT_ID=${process.env.CLIENT_ID || ''}\nOWNER_ID=${process.env.OWNER_ID || '1520810306211807453'}\n`
        );
      }
    } catch {}
  }
}

function start() {
  const entry = findProjectEntry();

  if (!entry) {
    console.error('═══════════════════════════════════════════════════════════════════════');
    console.error('[Hosting Boot] FATAL ERROR: Neither bundle.js, dist/index.js, nor src/index.ts found!');
    console.error('═══════════════════════════════════════════════════════════════════════');
    try {
      const files = fs.readdirSync(__dirname);
      console.error(`Current directory (${__dirname}) files:`, files.join(', '));
    } catch {}
    console.error('');
    console.error('👉 HOW TO FIX (SUPER EASY):');
    console.error('Upload the single file "bundle.js" from your PC to /home/container/ !');
    console.error('No folders needed!');
    console.error('═══════════════════════════════════════════════════════════════════════');
    process.exit(1);
  }

  // Switch working directory to project directory if nested
  if (entry.dir !== __dirname) {
    console.log(`[Hosting Boot] Project found in subfolder: ${entry.dir}. Switching directory...`);
    process.chdir(entry.dir);
  }

  // Load environment variables (.env / .env.example) across root and subfolders
  loadEnvironment(entry.dir);

  // Verify package.json and dependencies
  ensureDependencies(entry.dir);

  // Execute
  if (entry.type === 'bundle' || entry.type === 'dist') {
    require(entry.file);
  } else {
    console.log('[Hosting Boot] Running compilation (tsc)...');
    try {
      execSync('npm run build', { stdio: 'inherit', cwd: entry.dir });
      const compiled = path.join(entry.dir, 'dist', 'index.js');
      if (fs.existsSync(compiled)) {
        require(compiled);
        return;
      }
    } catch {
      console.warn('[Hosting Boot] Build step failed, launching via tsx...');
    }

    const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsx', entry.file], {
      stdio: 'inherit',
      cwd: entry.dir,
    });
    child.on('exit', (code) => process.exit(code || 0));
  }
}

start();

