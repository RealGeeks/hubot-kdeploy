const fs = require('fs');
const _ = require('lodash');
const yup = require('yup');

const loadConfigFile = () => {
  const configPath = process.env.HUBOT_KDEPLOY_CONFIG_JSON || 'kdeploy.config.json';
  return JSON.parse(fs.readFileSync(configPath).toString());
};

const buildAppSchema = ({ repos, targets }) => yup.object().shape({
  configRepo: yup
    .string()
    .oneOf(repos)
    .required(),
  configRepoPath: yup.string().required(),
  defaultBranch: yup.string().notRequired(),
  imageName: yup.string().required(),
  name: yup.string().required(),
  repo: yup.string().required(),
  requiredStatuses: yup
    .array()
    .of(yup.string().oneOf(['ci/circleci', 'docker/builder']))
    .notRequired(),
  strategy: yup.string().required(),
  targets: yup
    .array()
    .of(yup.string().oneOf(targets))
    .required(),
});

const repoSchema = yup.object().shape({
  branch: yup.string().required(),
  name: yup.string().required(),
  url: yup.string().required(),
});

const targetSchema = yup.object().shape({
  name: yup.string().required(),
  url: yup.string().required(),
});

const loadValues = (config, key, schema) => {
  const values = config[key] || [];

  return _.reduce(
    values,
    (acc, value) => {
      try {
        schema.validateSync(value, { abortEarly: false });
        acc[value.name] = value;
      } catch (err) {
        console.error(`kdeploy: invalid ${key} config, skipping ${JSON.stringify(value.name)}`);
        console.error(err);
      }

      return acc;
    },
    {},
  );
};

module.exports = () => {
  let config;

  try {
    config = loadConfigFile();
  } catch (err) {
    console.error('kdeploy: config missing or malformed');
    console.error(err);

    return null;
  }

  const targets = loadValues(config, 'targets', targetSchema);
  const repos = loadValues(config, 'repos', repoSchema);

  const appSchema = buildAppSchema({ repos: Object.keys(repos), targets: Object.keys(targets) });
  const apps = loadValues(config, 'apps', appSchema);

  return { targets, apps, repos };
};
