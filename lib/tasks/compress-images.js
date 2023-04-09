const fse = require('fs-extra');
const path = require('path');
const { resizeImage } = require('yair');
const { ORIGINAL_IMAGES_DIR, WEBP_IMAGES_DIR } = require('../constants');

fse.ensureDirSync(WEBP_IMAGES_DIR);

const compressImages = async () => {
  const fileNames = fse.readdirSync(ORIGINAL_IMAGES_DIR);

  await Promise.all([
    fileNames.map(async (fileName) => {
      const inputPath = path.join(ORIGINAL_IMAGES_DIR, `${fileName}`);
      const outputPath = path.join(WEBP_IMAGES_DIR, `${path.parse(fileName).name}.webp`);
      const buffer = await fse.readFile(inputPath);

      let data;

      try {
        ({ data } = await resizeImage(buffer, { webp: true }));
      } catch (err) {
        console.error(err);

        return;
      }

      fse.writeFileSync(outputPath, data);
    }),
  ]);
};

compressImages();
