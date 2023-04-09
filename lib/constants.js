const path = require('path');
const appRoot = require('app-root-path');

const IMAGES_DIR = path.join(appRoot.path, 'images');
const ORIGINAL_IMAGES_DIR = path.join(IMAGES_DIR, 'original');
const WEBP_IMAGES_DIR = path.join(IMAGES_DIR, 'webp');

console.log(WEBP_IMAGES_DIR)

module.exports = {
  IMAGES_DIR,
  ORIGINAL_IMAGES_DIR,
  WEBP_IMAGES_DIR,
};
