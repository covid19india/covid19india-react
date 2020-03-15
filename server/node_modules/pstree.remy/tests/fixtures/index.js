const spawn = require('child_process').spawn;
const sub = spawn(
  'sh',
  ['-c', 'node -e "setInterval(() => console.log(`running`), 200)"'],
  {
    stdio: 'pipe',
  }
);
