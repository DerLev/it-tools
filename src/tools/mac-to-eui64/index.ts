import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MAC to EUI-64',
  path: '/mac-to-eui64',
  description: 'Converts any MAC address into an EUI-64 MAC and a IPv6 link-local address',
  keywords: ['ipv6', 'address', 'converter', 'mac', 'eui64', 'eui-64', 'link-local'],
  component: () => import('./mac-to-eui64.vue'),
  icon: Binary,
  createdAt: new Date('2025-08-24'),
});
