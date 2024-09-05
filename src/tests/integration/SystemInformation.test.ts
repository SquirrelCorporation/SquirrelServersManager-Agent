// tests/integration/getDeviceInfo.test.ts

import getDeviceInfo from '@/utils/os.informations';
import si from 'systeminformation';

jest.mock('@/logger');

describe('Integration Test: getDeviceInfo', () => {
  const hostId = 'test-host-id';

  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Cleanup actions if necessary
  });

  test('should return correct static device information', async () => {
    const deviceInfo = await getDeviceInfo(hostId);

    // Check the basic properties
    expect(deviceInfo.id).toBe(hostId);
    expect(deviceInfo.agentVersion).toBeDefined();
    expect(deviceInfo.logPath).toBe(process.env.LOG_DIRECTORY);

    // Check static IP Address
    expect(deviceInfo.ip).toBe(process.env.OVERRIDE_IP_DETECTION);

    // Validate FQDN and Hostname
    const osInfo = await si.osInfo();
    expect(deviceInfo.fqdn).toBe(osInfo.fqdn);
    expect(deviceInfo.hostname).toBe(osInfo.hostname);

    // Validate OS Information
    expect(deviceInfo.os?.platform).toBe(osInfo.platform);
    expect(deviceInfo.os?.distro).toBe(osInfo.distro);
    expect(deviceInfo.os?.codename).toBe(osInfo.codename);
    expect(deviceInfo.os?.kernel).toBe(osInfo.kernel);
    expect(deviceInfo.os?.arch).toBe(osInfo.arch);
    expect(deviceInfo.os?.logofile).toBe(osInfo.logofile);

    // Validate System Information
    const systemInfo = await si.system();
    expect(deviceInfo.system?.manufacturer).toBe(systemInfo.manufacturer);
    expect(deviceInfo.system?.model).toBe(systemInfo.model);
    expect(deviceInfo.system?.version).toBe(systemInfo.version);
    expect(deviceInfo.system?.uuid).toBe(systemInfo.uuid);
    expect(deviceInfo.system?.sku).toBe(systemInfo.sku);
    expect(deviceInfo.system?.virtual).toBe(systemInfo.virtual);
    expect(deviceInfo.system?.raspberry).toBe(systemInfo.raspberry);
  });

  test('should return correct static device information', async () => {
    const deviceInfo = await getDeviceInfo(hostId);

    expect(deviceInfo.id).toBe(hostId);
    expect(deviceInfo.agentVersion).toBeDefined();  // Assuming agent version is defined elsewhere

    // Assumes these environment variables are set
    expect(deviceInfo.logPath).toBe('/app/logs');
    expect(deviceInfo.ip).toBe('192.168.1.100');

    // Validate FQDN and Hostname
    expect(deviceInfo.fqdn).toMatch(/^[a-z\-0-9]*(\.[a-z\-0-9]*)*$/);
    expect(deviceInfo.hostname).toMatch(/^[a-z\-0-9]+$/);

    // Validate OS Information
    expect(deviceInfo.os?.platform).toMatch(/linux/);
    expect(deviceInfo.os?.distro).toMatch(/(Ubuntu|Debian|Alpine|other)/);
    expect(deviceInfo.os?.codename).toBeDefined();
    expect(deviceInfo.os?.kernel).toBeDefined();
    expect(deviceInfo.os?.arch).toMatch(/(x64|arm64)/);
    expect(deviceInfo.os?.logofile).toBeDefined();

    // Validate System Information
    expect(deviceInfo.system?.manufacturer).toBeDefined();
    expect(deviceInfo.system?.model).toBe('Docker Container');
    expect(deviceInfo.system?.version).toBeDefined();
    expect(deviceInfo.system?.uuid).toBeDefined();
    expect(deviceInfo.system?.sku).toBeDefined();
  });
});
