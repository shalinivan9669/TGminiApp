// next.config.mjs
import { fileURLToPath } from 'url';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

// Получаем __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем плагин Next Intl
const withNextIntl = createNextIntlPlugin("./src/core/i18n/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Настраиваем алиасы
    config.resolve.alias['@'] = path.resolve(__dirname, 'src/app');
    config.resolve.alias['@public'] = path.resolve(__dirname, 'public');
    return config;
  },
};

export default withNextIntl(nextConfig);
