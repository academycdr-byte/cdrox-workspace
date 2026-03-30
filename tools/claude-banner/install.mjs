// CDROX Banner Installer
// Uso: node tools/claude-banner/install.mjs
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const HOME = process.env.USERPROFILE || process.env.HOME;
const BIN = join(HOME, 'bin');
const SCRIPT_DIR = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

console.log('');
console.log('\x1b[38;2;168;214;0m=== CDROX Banner Installer ===\x1b[0m');
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

// Step 3: Write claude.cmd with CRLF
const claudeCmd = [
  '@echo off',
  'node "%~dp0cdrox-banner.mjs"',
  `node "%APPDATA%\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js" --dangerously-skip-permissions --verbose %*`,
  ''
].join('\r\n');
writeFileSync(join(BIN, 'claude.cmd'), claudeCmd, 'ascii');
console.log(`[+] Criado: claude.cmd (wrapper com banner)`);

// Step 4: Write cmd-init.cmd with CRLF
const cmdInit = [
  '@echo off',
  `doskey claude="${BIN.replace(/\//g, '\\')}\\claude-start.cmd" $*`,
  ''
].join('\r\n');
writeFileSync(join(BIN, 'cmd-init.cmd'), cmdInit, 'ascii');
console.log(`[+] Criado: cmd-init.cmd (DOSKEY macro)`);

// Step 5: Write claude-start.cmd with CRLF (backup for DOSKEY)
const claudeStart = [
  '@echo off',
  'node "%~dp0cdrox-banner.mjs"',
  `node "%APPDATA%\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js" --dangerously-skip-permissions --verbose %*`,
  ''
].join('\r\n');
writeFileSync(join(BIN, 'claude-start.cmd'), claudeStart, 'ascii');
console.log(`[+] Criado: claude-start.cmd`);

// Step 6: Add ~/bin to USER PATH if not present
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
  console.log(`    Adicione manualmente: ${BIN}`);
}

// Step 7: Set CMD AutoRun registry key
try {
  const autoRunPath = join(BIN, 'cmd-init.cmd').replace(/\//g, '\\');
  execSync(
    `reg add "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /t REG_SZ /d "${autoRunPath}" /f`,
    { encoding: 'utf8', stdio: 'pipe' }
  );
  console.log(`[+] Registry AutoRun configurado`);
} catch (e) {
  console.log(`[!] Erro no registry: ${e.message}`);
}

console.log('');
console.log('\x1b[38;2;168;214;0m=== Instalacao completa! ===\x1b[0m');
console.log('');
console.log('Abra um NOVO terminal e digite: claude');
console.log('O banner CDROX verde vai aparecer antes do Claude Code iniciar.');
console.log('');
