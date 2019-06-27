const path = require('path');

process.env.HUBOT_KDEPLOY_CONFIG_JSON = path.join(__dirname, 'fixtures/kdeploy.config.json');
process.env.HUBOT_KDEPLOY_MACK_HOST = 'http://example.com';
