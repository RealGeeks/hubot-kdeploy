const { expect } = require('chai');
const config = require('../src/config');

describe('config', () => {
  it('loads app from a JSON config file', () => {
    expect(config.apps.mack).to.eql({
      configRepo: 'realgeeks/geekstack',
      configRepoPath: 'kube-config/infra/mack',
      defaultBranch: 'master',
      imageName: '558529356944.dkr.ecr.us-east-1.amazonaws.com/mack',
      name: 'mack',
      repo: 'realgeeks/mack',
      requiredStatuses: ['ci/circleci', 'docker/builder'],
      strategy: 'kubernetes/kustomize',
      targets: ['am1', 'am21'],
    });

    expect(config.repos['realgeeks/geekstack']).to.eql({
      branch: 'master',
      name: 'realgeeks/geekstack',
      url: 'git@github.com:RealGeeks/geekstack.git',
    });
  });
});
