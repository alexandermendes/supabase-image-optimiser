const { spawn } = require('child_process');
const { Observable } = require('rxjs');

module.exports.spawnObservableTask = (
  cmd,
  args = [],
  spawnOptions = {},
) => new Observable((observer) => {
  const observeAsync = async () => {
    try {
      await new Promise((resolve, reject) => {
        const child = spawn(
          cmd,
          [...args, ...process.argv.slice(2)],
          spawnOptions,
        );

        const errors = [];
        const readLine = (callback) => (data) => data
          .toString()
          .split(/\r?\n/)
          .filter((line) => line)
          .forEach(callback);

        child.stdout.on(
          'data',
          readLine((line) => observer.next(line)),
        );

        child.stderr.on(
          'data',
          readLine((line) => {
            errors.push(line);
          }),
        );

        child.on('close', (code) => {
          if (code) {
            reject(
              new Error(
                `Something went wrong while running command: ${cmd} ${args.join(
                  ' ',
                )}\n${errors.join('\n')}`,
              ),
            );
          }

          resolve();
        });
      });
    } catch (err) {
      observer.error(err);
    }

    observer.complete();
  };

  observeAsync();
});
