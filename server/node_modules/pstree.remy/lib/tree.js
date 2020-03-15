const spawn = require('child_process').spawn;

module.exports = function(rootPid, callback) {
  const tree = {};
  var output = '';

  // *nix
  const ps = spawn('ps', ['-A', '-o', 'ppid,pid']);
  ps.stdout.on('data', data => {
    output += data.toString('ascii');
  });

  ps.on('close', () => {
    try {
      const res = output
        .split('\n')
        .slice(1)
        .map(_ => _.trim())
        .reduce((acc, line) => {
          if (line.indexOf(rootPid + ' ') === 0) {
            const pid = line.split(/\s+/).pop();
            acc.push(parseInt(pid, 10));
            rootPid = pid;
          }

          return acc;
        }, []);

      callback(null, res);
    } catch (e) {
      callback(e, null);
    }
  });
};
