import dotenv from 'dotenv';
dotenv.config();

// Set up the environment for testing
//process.env.INPUT_APIKEY = 'please set me';
process.env['INPUT_MICROFRONTEND-SLUG'] = 'first-mfe';
process.env.INPUT_DOMAIN = 'https://console.mfe-orchestrator.dev';
process.env['INPUT_FILE-PATH'] = './__test__/test-files';
process.env.INPUT_VERSION = '1.0.1';


// Import the action after setting up the mocks
import('../index.js').catch(err => {
  console.error('❌ Error importing action:', err);
  process.exit(1);
}).then(()=>{
  console.log('✅ Action imported successfully');
  process.exit(0);
});
