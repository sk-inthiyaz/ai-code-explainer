const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Supported languages and their Docker images/commands
// Using alpine variants for smaller size and faster pulls
const languageConfigs = {
  javascript: {
    image: 'node:20-alpine',
    extension: 'js',
    runCmd: (filename) => `node /code/${filename}`
  },
  python: {
    image: 'python:3.11-alpine',
    extension: 'py',
    runCmd: (filename) => `python /code/${filename}`
  },
  java: {
    image: 'openjdk:17-alpine',
    extension: 'java',
    runCmd: (filename) => `javac /code/${filename} && java -cp /code Main`
  },
  cpp: {
    image: 'gcc:latest',
    extension: 'cpp',
    runCmd: (filename) => `g++ /code/${filename} -o /code/a.out && /code/a.out`
  }
};

function normalizeLanguage(lang) {
  if (!lang) return 'javascript';
  const l = String(lang).toLowerCase();
  if (l === 'c++' || l === 'cplus' || l === 'c plus plus') return 'cpp';
  if (l === 'js' || l === 'node' || l === 'javascript') return 'javascript';
  if (l === 'py' || l === 'python') return 'python';
  if (l === 'java') return 'java';
  if (l === 'cpp' || l === 'g++') return 'cpp';
  return l;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Runs code in a Docker container for the given language and input.
 * @param {string} code - The code to execute
 * @param {string} language - One of 'javascript', 'python', 'java', 'cpp'
 * @param {string} input - The input to pass to stdin
 * @param {number} [timeout=5] - Timeout in seconds
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
async function runCodeInDocker(code, language, input, timeout = 5) {
  const lang = normalizeLanguage(language);
  if (!languageConfigs[lang]) {
    throw new Error('Unsupported language');
  }
  const config = languageConfigs[lang];
  const tempDir = path.join(__dirname, '../../temp_code');
  ensureDir(tempDir);

  // Java must have class name matching file name; we'll enforce Main.java
  const baseName = (lang === 'java') ? 'Main' : uuidv4();
  const filename = `${baseName}.${config.extension}`;
  const filepath = path.join(tempDir, filename);
  fs.writeFileSync(filepath, code);

  // Mount tempDir as /code in the container
  // -i keeps STDIN open so we can pipe input; wrap inner command in double quotes for cross-shell
  // Use numeric seconds without suffix for compatibility with BusyBox (Alpine) and GNU timeout
  const innerCmd = `timeout ${timeout} ${config.runCmd(filename)}`;
  const dockerCmd = [
    'docker run --rm -i',
    `-m 128m --cpus=0.5`,
    `-v "${tempDir}:/code"`,
    `${config.image}`,
    '/bin/sh -lc',
    `"${innerCmd.replace(/"/g, '\\"')}"`
  ].join(' ');

  return new Promise((resolve) => {
    const child = exec(dockerCmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      // Clean up temp file
      try { fs.unlinkSync(filepath); } catch {}
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: error && error.code ? error.code : 0
      });
    });
    if (typeof input !== 'undefined' && input !== null) {
      const inputStr = (typeof input === 'string') ? input : JSON.stringify(input);
      child.stdin.write(inputStr.endsWith('\n') ? inputStr : inputStr + '\n');
      child.stdin.end();
    }
  });
}

module.exports = { runCodeInDocker };
