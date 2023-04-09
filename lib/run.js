const path = require('path');
const Listr = require('listr');
const { spawnObservableTask } = require('./child-process');
const { WEBP_IMAGES_DIR } = require('./constants');

const getTask = (name) => path.join(__dirname, 'tasks', `${name}.js`);

const tasks = new Listr([
  {
    title: 'Downloading images from Supabase',
    task: () => spawnObservableTask('node', [getTask('download-images')]),
  },
  {
    title: 'Optimising images',
    task: () => spawnObservableTask('node', [getTask('compress-images')]),
  },
  {
    title: 'Upload compressed images',
    task: () => spawnObservableTask('node', [
      getTask('upload-images'),
      WEBP_IMAGES_DIR,
    ]),
  },
]);

module.exports.run = async () => tasks.run({});
