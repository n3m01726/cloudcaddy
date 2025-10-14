import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Racine du backend
export const rootPath = path.resolve(__dirname, '..');
export const srcPath = path.join(rootPath, 'src');

export const paths = {
  config: path.join(srcPath, 'config'),
  connectors: path.join(srcPath, 'connectors'),
  services: path.join(srcPath, 'services'),
  routes: path.join(srcPath, 'routes'),
  middlewares: path.join(srcPath, 'middlewares'),
};