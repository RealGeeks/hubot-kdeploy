const chai = require('chai');
const config = require('../src/config');

const { expect } = chai;

describe('config', () => {
  it('loads app from a JSON config file', () => {
    expect(config).to.eql({
      apps: {
        mack: {
          configRepo: 'realgeeks/geekstack',
          configRepoPath: 'kube-config/infra/mack',
          defaultBranch: 'master',
          imageName: '558529356944.dkr.ecr.us-east-1.amazonaws.com/mack',
          name: 'mack',
          requiredStatuses: ['ci/circleci', 'docker/builder'],
          strategy: 'kubernetes/kustomize',
          targets: ['am1', 'am21'],
        },
      },
      repos: {
        'realgeeks/geekstack': {
          branch: 'master',
          name: 'realgeeks/geekstack',
          url: 'git@github.com:RealGeeks/geekstack.git',
        },
      },
    });
  });
});
