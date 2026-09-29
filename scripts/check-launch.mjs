import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../src/config.ts', import.meta.url), 'utf8');
const number = config.match(/^export const DEMO_WHATSAPP_NUMBER = '([^']*)';$/m)?.[1];

if (!number || !/^\d{10,16}$/.test(number)) {
  console.error('STOP: isi DEMO_WHATSAPP_NUMBER di src/config.ts dengan 10–16 digit tanpa + atau spasi sebelum build publik.');
  process.exit(1);
}

console.log('PASS: kontak Jadwalkan Demo sudah dikonfigurasi.');
