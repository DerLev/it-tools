<script setup lang="ts">
import { convertMacToEui64, eui64Ipv6LinkLocal, isValidMac } from './mac-to-eui64.service';
import { useValidation } from '@/composable/validation';

const rawMacAddress = useStorage('mac-to-eui64:ip', 'aa:bb:cc:dd:ee:ff');

const convertedSections = computed(() => {
  const eui64 = convertMacToEui64({ mac: rawMacAddress.value });
  const ipv6Eui64 = convertMacToEui64({ mac: rawMacAddress.value, ipv6: true });
  let ipv6LinkLocal = '';
  if (ipv6Eui64) {
    ipv6LinkLocal = eui64Ipv6LinkLocal({ eui64: ipv6Eui64 });
  }

  return [
    {
      label: 'EUI-64 MAC:',
      value: eui64,
    },
    {
      label: 'IPv6 link-local address:',
      value: ipv6LinkLocal,
    },
  ];
});

const { attrs: validationAttrs } = useValidation({
  source: rawMacAddress,
  rules: [{ message: 'Invalid MAC address', validator: mac => isValidMac({ mac }) }],
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawMacAddress"
      label="MAC Address:"
      placeholder="aa:bb:cc:dd:ee:ff"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />

    <n-divider />

    <input-copyable
      v-for="{ label, value } of convertedSections"
      :key="label"
      :label="label"
      label-position="left"
      label-width="10rem"
      label-align="right"
      mb-2
      :value="validationAttrs.validationStatus === 'error' ? '' : value"
      placeholder="Set a correct MAC address"
    />
  </div>
</template>
