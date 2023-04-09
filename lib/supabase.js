const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const { argv } = require('./args');

dotenv.config();

module.exports.supabase = createClient(
  argv.url || process.env.SUPABASE_PROJECT_URL,
  argv.key || process.env.SUPABASE_SERVICE_ROLE_KEY,
);
