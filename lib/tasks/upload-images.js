const fse = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const { supabase } = require('../supabase');
const { argv } = require('../args');

const ONE_DAY = 86400;

const uploadImages = async () => {
  const [dirPath] = argv._;
  const dir = path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath);
  const fileNames = fse.readdirSync(dir);

  console.log(`Uploading ${fileNames.length} files from ${dir}`);
  await Promise.all([
    fileNames.map(async (fileName) => {
      console.log(`Uploading ${fileName}`);

      if (argv.dry) {
        return;
      }

      const { error } = await supabase
        .storage
        .from(argv.bucket)
        .upload(
          [argv.folder, fileName].filter((x) => x).join('/'),
          fse.readFileSync(path.join(dir, fileName)),
          {
            upsert: true,
            cacheControl: ONE_DAY,
            contentType: mime.lookup(fileName),
          },
        );

      if (error) {
        throw new Error(error.message);
      }
    }),
  ]);
};

uploadImages();
