const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(prefix, message, color = colors.reset) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

// Check if directories exist
const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(backendDir)) {
  log('ERROR', 'Backend directory not found!', colors.red);
  process.exit(1);
}

if (!fs.existsSync(frontendDir)) {
  log('ERROR', 'Frontend directory not found!', colors.red);
  process.exit(1);
}

// Check if node_modules exist
if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
  log('INFO', 'Installing backend dependencies...', colors.yellow);
  spawn('npm', ['install'], { 
    stdio: 'inherit', 
    cwd: backendDir 
  }).on('close', (code) => {
    if (code !== 0) {
      log('ERROR', 'Failed to install backend dependencies', colors.red);
      process.exit(1);
    }
    startServers();
  });
} else if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
  log('INFO', 'Installing frontend dependencies...', colors.yellow);
  spawn('npm', ['install'], { 
    stdio: 'inherit', 
    cwd: frontendDir 
  }).on('close', (code) => {
    if (code !== 0) {
      log('ERROR', 'Failed to install frontend dependencies', colors.red);
      process.exit(1);
    }
    startServers();
  });
} else {
  startServers();
}

function startServers() {
  log('INFO', 'Starting DayFlow HRMS Development Servers...', colors.cyan);
  log('INFO', 'Backend will run on http://localhost:5000', colors.green);
  log('INFO', 'Frontend will run on http://localhost:3000', colors.green);
  log('INFO', 'Press Ctrl+C to stop all servers', colors.yellow);
  console.log('');

  // Start backend server
  const backend = spawn('npm', ['start'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: backendDir,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  backend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log('BACKEND', output, colors.blue);
    }
  });

  backend.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log('BACKEND', output, colors.red);
    }
  });

  // Start frontend server (with delay to ensure backend starts first)
  setTimeout(() => {
    const frontend = spawn('npm', ['start'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: frontendDir,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    frontend.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log('FRONTEND', output, colors.green);
      }
    });

    frontend.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log('FRONTEND', output, colors.red);
      }
    });

    frontend.on('close', (code) => {
      if (code !== 0) {
        log('FRONTEND', `Frontend process exited with code ${code}`, colors.red);
      }
    });

    // Handle process termination
    process.on('SIGINT', () => {
      log('INFO', 'Shutting down servers...', colors.yellow);
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
      process.exit(0);
    });

  }, 3000); // 3 second delay

  backend.on('close', (code) => {
    if (code !== 0) {
      log('BACKEND', `Backend process exited with code ${code}`, colors.red);
    }
  });
}
