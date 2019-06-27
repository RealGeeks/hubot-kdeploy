const fs = require('fs');
const _ = require('lodash');

const configPath = process.env.HUBOT_KDEPLOY_CONFIG_JSON || 'kdeploy.config.json';

const loadConfig = () => {
  try {
    const file = JSON.parse(fs.readFileSync(configPath).toString());

    const apps = _.reduce(
      file.apps,
      (acc, app) => {
        acc[app.name] = app;
        return acc;
      },
      {},
    );

    const repos = _.reduce(
      file.repos,
      (acc, repo) => {
        acc[repo.name] = repo;
        return acc;
      },
      {},
    );

    return { apps, repos };
  } catch (err) {
    console.error(err);
    console.log("kdeploy won't work: config missing or malformed");

    return null;
  }
};

module.exports = loadConfig();
