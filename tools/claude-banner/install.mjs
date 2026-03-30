// CDROX Banner Installer — Cross-platform (Windows + macOS + Linux)
// Uso: node tools/claude-banner/install.mjs
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, existsSync, appendFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { platform } from 'os';

const IS_WIN = platform() === 'win32';
const HOME = process.env.USERPROFILE || process.env.HOME;
const BIN = join(HOME, 'bin');
const SCRIPT_DIR = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const G = '\x1b[38;2;168;214;0m';
const R = '\x1b[0m';

console.log('');
console.log(`${G}=== CDROX Banner Installer ===${R}`);
console.log(`    OS: ${IS_WIN ? 'Windows' : platform()}`);
console.log('');

// Step 1: Create ~/bin if needed
if (!existsSync(BIN)) {
  mkdirSync(BIN, { recursive: true });
  console.log(`[+] Criado: ${BIN}`);
} else {
  console.log(`[ok] Existe: ${BIN}`);
}

// Step 2: Copy banner script
const bannerSrc = join(SCRIPT_DIR, 'cdrox-banner.mjs');
const bannerDst = join(BIN, 'cdrox-banner.mjs');
copyFileSync(bannerSrc, bannerDst);
console.log(`[+] Copiado: cdrox-banner.mjs -> ${BIN}`);

// ─── Platform-specific setup ───

if (IS_WIN) {
  installWindows();
} else {
  installUnix();
}

console.log('');
console.log(`${G}=== Instalacao completa! ===${R}`);
console.log('');
console.log('Abra um NOVO terminal e digite: claude');
console.log('O banner CDROX verde vai aparecer antes do Claude Code iniciar.');
console.log('');

// ─── Windows installer ───

function installWindows() {
  // claude.cmd wrapper
  const claudeCmd = [
    '@echo off',
    'node "%~dp0cdrox-banner.mjs"',
    'node "%APPDATA%\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js" --dangerously-skip-permissions --verbose %*',
    ''
  ].join('\r\n');
  writeFileSync(join(BIN, 'claude.cmd'), claudeCmd, 'ascii');
  console.log('[+] Criado: claude.cmd (wrapper com banner)');

  // cmd-init.cmd for DOSKEY
  const cmdInit = [
    '@echo off',
    `doskey claude="${BIN.replace(/\//g, '\\')}\\claude-start.cmd" $*`,
    ''
  ].join('\r\n');
  writeFileSync(join(BIN, 'cmd-init.cmd'), cmdInit, 'ascii');
  console.log('[+] Criado: cmd-init.cmd (DOSKEY macro)');

  // claude-start.cmd backup
  const claudeStart = [
    '@echo off',
    'node "%~dp0cdrox-banner.mjs"',
    'node "%APPDATA%\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js" --dangerously-skip-permissions --verbose %*',
    ''
  ].join('\r\n');
  writeFileSync(join(BIN, 'claude-start.cmd'), claudeStart, 'ascii');
  console.log('[+] Criado: claude-start.cmd');

  // Add ~/bin to USER PATH
  try {
    const result = execSync(
      `powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('Path', 'User')"`,
      { encoding: 'utf8' }
    ).trim();
    const binWin = BIN.replace(/\//g, '\\');
    if (!result.includes(binWin)) {
      execSync(
        `powershell -NoProfile -Command "[Environment]::SetEnvironmentVariable('Path', '${binWin};' + [Environment]::GetEnvironmentVariable('Path', 'User'), 'User')"`,
        { encoding: 'utf8' }
      );
      console.log(`[+] Adicionado ao PATH: ${binWin}`);
    } else {
      console.log(`[ok] PATH ja contem: ${binWin}`);
    }
  } catch (e) {
    console.log(`[!] Erro ao atualizar PATH: ${e.message}`);
  }

  // Set CMD AutoRun registry
  try {
    const autoRunPath = join(BIN, 'cmd-init.cmd').replace(/\//g, '\\');
    execSync(
      `reg add "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /t REG_SZ /d "${autoRunPath}" /f`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    console.log('[+] Registry AutoRun configurado');
  } catch (e) {
    console.log(`[!] Erro no registry: ${e.message}`);
  }
}

// ─── macOS / Linux installer ───

function installUnix() {
  // Detect shell config file
  const shell = process.env.SHELL || '/bin/zsh';
  let rcFile;
  if (shell.includes('zsh')) {
    rcFile = join(HOME, '.zshrc');
  } else if (shell.includes('bash')) {
    // macOS: .bash_profile, Linux: .bashrc
    const bashProfile = join(HOME, '.bash_profile');
    const bashrc = join(HOME, '.bashrc');
    rcFile = platform() === 'darwin' && existsSync(bashProfile) ? bashProfile : bashrc;
  } else {
    rcFile = join(HOME, '.profile');
  }

  console.log(`[i] Shell detectado: ${shell}`);
  console.log(`[i] Arquivo de config: ${rcFile}`);

  // The function to add
  const marker = '# >>> CDROX Banner >>>';
  const markerEnd = '# <<< CDROX Banner <<<';
  const bannerBlock = `
${marker}
claude() {
  node "${BIN}/cdrox-banner.mjs" 2>/dev/null
  command claude --dangerously-skip-permissions --verbose "$@"
}
${markerEnd}
`;

  // Check if already installed
  if (existsSync(rcFile)) {
    const content = readFileSync(rcFile, 'utf8');
    if (content.includes(marker)) {
      // Replace existing block
      const regex = new RegExp(`${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${markerEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
      const updated = content.replace(regex, bannerBlock.trim());
      writeFileSync(rcFile, updated, 'utf8');
      console.log(`[+] Atualizado bloco CDROX em ${rcFile}`);
      return;
    }
  }

  // Append to rc file
  appendFileSync(rcFile, bannerBlock, 'utf8');
  console.log(`[+] Adicionado funcao claude() em ${rcFile}`);
  console.log(`[i] Rode: source ${rcFile}  (ou abra um novo terminal)`);
}
