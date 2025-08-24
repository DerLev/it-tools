import { describe, expect, it } from 'vitest';
import { convertMacToEui64, eui64Ipv6LinkLocal, eui64ToIpv6Format, isValidMac, splitMac } from './mac-to-eui64.service';

describe('ipv4-address-converter', () => {
  describe('isValidMac', () => {
    it('should return true for a valid MAC address', () => {
      expect(isValidMac({ mac: 'aa:bb:cc:dd:ee:ff' })).toBe(true);
      expect(isValidMac({ mac: 'AA:BB:CC:DD:EE:FF' })).toBe(true);
      expect(isValidMac({ mac: '01:23:45:56:78:9a' })).toBe(true);
      expect(isValidMac({ mac: '01-23-45-56-78-9a' })).toBe(true);
    });

    it('should return false for an invalid MAC address', () => {
      expect(isValidMac({ mac: 'aa:bb:cc:dd:ee' })).toBe(false);
      expect(isValidMac({ mac: 'AA:BB:CC:DD:EE:GG' })).toBe(false);
      expect(isValidMac({ mac: '01_23_45_56_78_9a' })).toBe(false);
      expect(isValidMac({ mac: '01-23-45-56-78-9a-bc' })).toBe(false);
      expect(isValidMac({ mac: '01-23-45-5-78-9a' })).toBe(false);
    });
  });

  describe('splitMac', () => {
    it('should return 6 items in an array containing the 6 parts of a given MAC address', () => {
      expect(splitMac({ mac: 'aa:bb:cc:dd:ee:ff' })).toStrictEqual(['aa', 'bb', 'cc', 'dd', 'ee', 'ff']);
      expect(splitMac({ mac: 'AA:BB:CC:DD:EE:FF' })).toStrictEqual(['AA', 'BB', 'CC', 'DD', 'EE', 'FF']);
      expect(splitMac({ mac: '01:23:45:56:78:9a' })).toStrictEqual(['01', '23', '45', '56', '78', '9a']);
      expect(splitMac({ mac: '01-23-45-56-78-9a' })).toStrictEqual(['01', '23', '45', '56', '78', '9a']);
    });

    it('should return undefined for malformed MAC addresses', () => {
      expect(splitMac({ mac: 'aa:bb:cc:dd:ee' })).toBe(undefined);
      expect(splitMac({ mac: 'AA:BB:CC:DD:EE:GG' })).toBe(undefined);
      expect(splitMac({ mac: '01_23_45_56_78_9a' })).toBe(undefined);
      expect(splitMac({ mac: '01-23-45-56-78-9a-bc' })).toBe(undefined);
      expect(splitMac({ mac: '01-23-45-5-78-9a' })).toBe(undefined);
    });
  });

  describe('convertMacToEui64', () => {
    it('should convert valid MAC addresses into their standard EUI-64 representation', () => {
      expect(convertMacToEui64({ mac: 'aa:bb:cc:dd:ee:ff' })).toBe('aa:bb:cc:ff:fe:dd:ee:ff');
      expect(convertMacToEui64({ mac: 'AA:BB:CC:DD:EE:FF' })).toBe('aa:bb:cc:ff:fe:dd:ee:ff');
      expect(convertMacToEui64({ mac: '01:23:45:56:78:9a' })).toBe('01:23:45:ff:fe:56:78:9a');
      expect(convertMacToEui64({ mac: '01-23-45-56-78-9a' })).toBe('01:23:45:ff:fe:56:78:9a');
    });

    it('should convert valid MAC addresses into their modified EUI-64 representation for IPv6 use', () => {
      expect(convertMacToEui64({ mac: 'aa:bb:cc:dd:ee:ff', ipv6: true })).toBe('a8:bb:cc:ff:fe:dd:ee:ff');
      expect(convertMacToEui64({ mac: 'AA:BB:CC:DD:EE:FF', ipv6: true })).toBe('a8:bb:cc:ff:fe:dd:ee:ff');
      expect(convertMacToEui64({ mac: '01:23:45:56:78:9a', ipv6: true })).toBe('03:23:45:ff:fe:56:78:9a');
      expect(convertMacToEui64({ mac: '01-23-45-56-78-9a', ipv6: true })).toBe('03:23:45:ff:fe:56:78:9a');
    });

    it('shouldn\'t convert invalid MAC addresses', () => {
      expect(convertMacToEui64({ mac: 'aa:bb:cc:dd:ee' })).toBe(undefined);
      expect(convertMacToEui64({ mac: 'AA:BB:CC:DD:EE:GG' })).toBe(undefined);
      expect(convertMacToEui64({ mac: '01_23_45_56_78_9a' })).toBe(undefined);
      expect(convertMacToEui64({ mac: '01-23-45-56-78-9a-bc' })).toBe(undefined);
      expect(convertMacToEui64({ mac: '01-23-45-5-78-9a' })).toBe(undefined);
      expect(convertMacToEui64({ mac: 'aa:bb:cc:dd:ee', ipv6: true })).toBe(undefined);
      expect(convertMacToEui64({ mac: 'AA:BB:CC:DD:EE:GG', ipv6: true })).toBe(undefined);
      expect(convertMacToEui64({ mac: '01_23_45_56_78_9a', ipv6: true })).toBe(undefined);
      expect(convertMacToEui64({ mac: '01-23-45-56-78-9a-bc', ipv6: true })).toBe(undefined);
      expect(convertMacToEui64({ mac: '01-23-45-5-78-9a', ipv6: true })).toBe(undefined);
    });
  });

  describe('eui64ToIpv6Format', () => {
    it('should convert valid EUI-64 MAC addresses into the IPv6 representation', () => {
      expect(eui64ToIpv6Format({ eui64: 'aa:bb:cc:ff:fe:dd:ee:ff' })).toBe('aabb:ccff:fedd:eeff');
      expect(eui64ToIpv6Format({ eui64: '01:23:45:ff:fe:56:78:9a' })).toBe('0123:45ff:fe56:789a');
      expect(eui64ToIpv6Format({ eui64: '01:23:45:ff:fe:56:78:9a' })).toBe('0123:45ff:fe56:789a');
      expect(eui64ToIpv6Format({ eui64: 'a8:bb:cc:ff:fe:dd:ee:ff' })).toBe('a8bb:ccff:fedd:eeff');
      expect(eui64ToIpv6Format({ eui64: '03:23:45:ff:fe:56:78:9a' })).toBe('0323:45ff:fe56:789a');
      expect(eui64ToIpv6Format({ eui64: '03:23:45:ff:fe:56:78:9a' })).toBe('0323:45ff:fe56:789a');
    });
  });

  describe('eui64Ipv6LinkLocal', () => {
    it('should convert valid EUI-64 MAC addresses into an IPv6 link-local address', () => {
      expect(eui64Ipv6LinkLocal({ eui64: 'aa:bb:cc:ff:fe:dd:ee:ff' })).toBe('fe80::aabb:ccff:fedd:eeff');
      expect(eui64Ipv6LinkLocal({ eui64: '01:23:45:ff:fe:56:78:9a' })).toBe('fe80::0123:45ff:fe56:789a');
      expect(eui64Ipv6LinkLocal({ eui64: '01:23:45:ff:fe:56:78:9a' })).toBe('fe80::0123:45ff:fe56:789a');
      expect(eui64Ipv6LinkLocal({ eui64: 'a8:bb:cc:ff:fe:dd:ee:ff' })).toBe('fe80::a8bb:ccff:fedd:eeff');
      expect(eui64Ipv6LinkLocal({ eui64: '03:23:45:ff:fe:56:78:9a' })).toBe('fe80::0323:45ff:fe56:789a');
      expect(eui64Ipv6LinkLocal({ eui64: '03:23:45:ff:fe:56:78:9a' })).toBe('fe80::0323:45ff:fe56:789a');
    });
  });
});
