const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

module.exports.argv = yargs(hideBin(process.argv)).argv;
