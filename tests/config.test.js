const fs = require('fs');
const mockFs = require('mock-fs');

const configFixture = fs.readFileSync('tests/fixtures/kdeploy.config.json');

mockFs({
  'kdeploy.config.json': configFixture,
});

const config = fs.readFileSync('kdeploy.config.json').toString();

mockFs.restore();
