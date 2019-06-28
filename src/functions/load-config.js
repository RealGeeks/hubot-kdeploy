const fs = require('fs');
const _ = require('lodash');
const yup = require('yup');

const loadConfigFile = () => {
  const configPath = process.env.HUBOT_KDEPLOY_CONFIG_JSON || 'kdeploy.config.json';
  return JSON.parse(fs.readFileSync(configPath).toString());
};

const buildAppSchema = validRepos => yup.object().shape({
  configRepo: yup
    .string()
    .oneOf(validRepos)
    .required(),
  configRepoPath: yup.string().required(),
  defaultBranch: yup.string().notRequired(),
  imageName: yup.string().required(),
  name: yup.string().required(),
  requiredStatuses: yup
    .array()
    .of(yup.string().oneOf(['ci/circleci', 'docker/builder']))
    .notRequired(),
  strategy: yup.string().required(),
  targets: yup
    .array()
    .of(yup.string().oneOf(['am1', 'am21']))
    .required(),
});

const repoSchema = yup.object().shape({
  branch: yup.string().required(),
  name: yup.string().required(),
  url: yup.string().required(),
});

module.exports = () => {
  let config;

  try {
    config = loadConfigFile();
  } catch (err) {
    console.error('kdeploy: config missing or malformed');
    console.error(err);

    return null;
  }

  const repos = _.reduce(
    config.repos,
    (acc, repo) => {
      try {
        repoSchema.validateSync(repo, { abortEarly: false });
        acc[repo.name] = repo;
      } catch (err) {
        console.error(`kdeploy: invalid repo config, skipping ${JSON.stringify(app)}`);
        console.error(err);
      }

      return acc;
    },
    {},
  );

  const appSchema = buildAppSchema(Object.keys(repos));

  const apps = _.reduce(
    config.apps,
    (acc, app) => {
      try {
        appSchema.validateSync(app, { abortEarly: false });
        acc[app.name] = app;
      } catch (err) {
        console.error(`kdeploy: invalid app config, skipping ${JSON.stringify(app)}`);
        console.error(err);
      }

      return acc;
    },
    {},
  );

  return { apps, repos };
};
