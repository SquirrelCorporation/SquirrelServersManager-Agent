import logger from '../../logger';
import { ssmExecSync } from '../process/exec';

const runInHostNamespace = (command: string): string => {
  try {
    return ssmExecSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    logger.error('Error running command in host namespace:', error);
    return '';
  }
};

export const getHostPlatform = (): string => {
  const unameOutput = runInHostNamespace('uname');
  switch (unameOutput) {
    case 'Linux':
      // Further check for Android (commonly has `android` identifier)
      const osRelease = runInHostNamespace('cat /proc/sys/kernel/osrelease');
      if (osRelease.includes('android')) {
        return 'android';
      }
      return 'linux';
    case 'Darwin':
      return 'darwin';
    case 'FreeBSD':
      return 'freebsd';
    case 'OpenBSD':
      return 'openbsd';
    case 'NetBSD':
      return 'netbsd';
    case 'SunOS':
      return 'sunos';
    case 'Windows_NT':
      return 'win32';
    default:
      return 'unknown';
  }
};
