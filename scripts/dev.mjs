import { spawn } from 'node:child_process';

const commands = [
  ['server', 'npm.cmd', ['run', 'dev:server']],
  ['client', 'npm.cmd', ['run', 'dev:client']],
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    shell: true,
    stdio: 'pipe',
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
      children.forEach((item) => item.kill());
    }
  });

  return child;
});

const shutdown = () => {
  children.forEach((child) => child.kill());
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
