const fse = require('fs-extra');
const path = require('path');
const imageExtensions = require('image-extensions');
const download = require('image-downloader');
const { ORIGINAL_IMAGES_DIR } = require('../constants');
const { supabase } = require('../supabase');
const { argv } = require('../args');

fse.ensureDirSync(ORIGINAL_IMAGES_DIR);

const downloadFiles = async (files) => {
  const undownloadedFiles = files.filter(
    (file) => !fse.existsSync(path.join(ORIGINAL_IMAGES_DIR, file.name)),
  );

  console.log(`Downloading ${undownloadedFiles.length} files`);
  await Promise.all([
    undownloadedFiles.map(async (file) => {
      console.log(`Downloading ${file.name}`);
      const { data } = supabase
        .storage
        .from(argv.bucket)
        .getPublicUrl([argv.folder, file.name].filter((x) => x).join('/'));

      return download.image({
        url: data.publicUrl,
        dest: ORIGINAL_IMAGES_DIR,
      });
    }),
  ]);
};

const getAllFiles = async (offset = 0) => {
  const { data, error } = await supabase
    .storage
    .from(argv.bucket)
    .list(argv.folder, {
      limit: 100,
      offset,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (data.length) {
    return [
      ...data,
      ...(await getAllFiles(data.length + offset)),
    ];
  }

  return data;
};

const isImage = (ext) => imageExtensions.includes(ext.replace(/^\./, ''));

const filterUnconvertedFiles = (files) => {
  const convertedFiles = [];
  const convertedFileNames = [];
  const unconvertedFiles = [];
  const unconvertedFileNames = [];

  files.forEach((file) => {
    const { name, ext } = path.parse(file.name);

    if (!isImage(ext)) {
      return;
    }

    if (ext === '.webp') {
      convertedFiles.push(file);
      convertedFileNames.push(name);

      return;
    }

    unconvertedFiles.push(file);
    unconvertedFileNames.push(name);
  });

  return files.filter((file) => {
    const { name, ext } = path.parse(file.name);

    return isImage(ext)
      && unconvertedFileNames.includes(name)
      && !convertedFileNames.includes(name);
  });
};

const downloadImages = async () => {
  const files = await getAllFiles();
  const maxFiles = argv.max || 1;

  let unconvertedImages = filterUnconvertedFiles(files, isImage, '.webp');

  if (maxFiles) {
    unconvertedImages = unconvertedImages.slice(0, maxFiles);
  }

  await downloadFiles(unconvertedImages);
};

downloadImages();
