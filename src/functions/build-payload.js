const _ = require('lodash');
const config = require('../config');

module.exports = ({
  name, ref, target, adapter, room, user,
}) => {
  const appConfig = config.apps[name];

  if (!appConfig) throw Error(`Config for ${name}: missing or malformed`);

  const realTarget = target || appConfig.targets[0];

  if (realTarget && !_.includes(appConfig.targets, realTarget)) {
    throw Error(`Config for ${name}: target ${realTarget} not in ${appConfig.targets}`);
  }

  const configRepo = config.repos[appConfig.configRepo];

  return {
    name,
    source: {
      type: 'git',
      configRepositoryUrl: configRepo.url,
      configRepository: configRepo.name,
      configBranch: configRepo.branch,
      repository: configRepo.name,
      branch: ref || appConfig.defaultBranch,
    },
    config: {
      target: realTarget,
      strategy: appConfig.strategy,
      path: appConfig.configRepoPath,
      imageName: appConfig.imageName,
      requiredStatuses: appConfig.requireStatuses || [],
    },
    notify: {
      adapter,
      room,
      user,
      userName: user.name,
    },
  };
};