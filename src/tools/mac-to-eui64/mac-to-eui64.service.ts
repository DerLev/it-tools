export { isValidMac, splitMac, convertMacToEui64, eui64ToIpv6Format, eui64Ipv6LinkLocal };

/**
 * Validates a MAC address
 * @param param0.mac MAC to check the validity of
 * @returns Result whether the given MAC is valid or not
 */
function isValidMac({ mac }: { mac: string }) {
  const cleanMac = mac.trim();

  return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(cleanMac);
}

/**
 * Splits a given MAC address into 6 chunks, returns undefined if not possible
 * @param param0.mac MAC to split into 6 chunks
 * @returns Array of strings containing the chunks of the given MAC
 */
function splitMac({ mac }: { mac: string }) {
  if (!isValidMac({ mac })) {
    return;
  }

  const matches = mac.replace(/[\W_]+/g, '').match(/.{1,2}/g);
  if (!matches || matches.length !== 6) {
    return;
  }

  return matches;
}

/**
 * Converts a given MAC into its EUI-64 representation
 * @param param0.mac MAC to convert to EUI-64
 * @param param0.ipv6 Whether to invert the 7th bit for usage in IPv6 or not
 * @returns EUI-64 representation of the given MAC
 */
function convertMacToEui64({ mac, ipv6 = false }: { mac: string; ipv6?: boolean }) {
  const matchedMac = splitMac({ mac });
  if (!matchedMac) {
    return;
  }

  /* convert mac parts into numbers */
  const macArray = matchedMac.map(part => Number.parseInt(part, 16));

  /* invert 7th bit of first byte for ipv6 usage */
  if (ipv6) {
    macArray[0] ^= 0x02;
  }

  const eui64Array = [
    macArray[0], macArray[1], macArray[2],
    0xFF, 0xFE,
    macArray[3], macArray[4], macArray[5],
  ];

  return eui64Array.map(byte => byte.toString(16).padStart(2, '0')).join(':');
}

/**
 * Converts the formatting of a EUI-64 MAC address to be compatible with IPv6
 * @param param0.eui64 MAC in EUI-64 representation
 * @returns EUI-64 MAC in the format of IPv6
 */
function eui64ToIpv6Format({ eui64 }: { eui64: string }) {
  return eui64.replace(/:/g, '').match(/.{1,4}/g)!.join(':');
}

/**
 * Converts an EUI-64 MAC into a link-local address in IPv6
 * @param param0.eui64 MAC in EUI-64 representation
 * @returns A valid IPv6 link-local address for the given EUI-64 MAC
 */
function eui64Ipv6LinkLocal({ eui64 }: { eui64: string }) {
  return `fe80::${eui64ToIpv6Format({ eui64 })}`;
}
