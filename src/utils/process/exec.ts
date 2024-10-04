import { exec, execSync, spawn } from 'child_process';

export const ssmExecSync = (command: string, options?: any )=> {
  return execSync(`nsenter -t 1 -m -u -n -i sh -c "${command}"`, options);
}

export const ssmExec = (command: string, options?: any )=> {
  return exec(`nsenter -t 1 -m -u -n -i sh -c "${command}"`, options);
}

export const execSafe = (cmd: string, args?: any, options?: any) => {
  let result = '';
  options = options || {};

  return new Promise((resolve) => {
    process.nextTick(() => {
      try {
        const child = spawn(`nsenter -t 1 -m -u -n -i sh -c "${cmd}"`, args, options);

        if (child && !child.pid) {
          child.on('error', function () {
            resolve(result);
          });
        }
        if (child && child.pid) {
          child.stdout.on('data', function (data) {
            result += data.toString();
          });
          child.on('close', function () {
            child.kill();
            resolve(result);
          });
          child.on('error', function () {
            child.kill();
            resolve(result);
          });
        } else {
          resolve(result);
        }
      } catch (e) {
        resolve(result);
      }
    });
  });
}
