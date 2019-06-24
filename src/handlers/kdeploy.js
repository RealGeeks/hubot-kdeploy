// Description
//   A hubot script that deploys to K8s via Mack
//
// Configuration:
//   MACK_HOST
//   MACK_API_KEY
//
// Commands:
//   hubot kdeploy mack
//   hubot kdeploy mack to am1
//   hubot kdeploy mack/master to am1
//
// Author:
//   Lars Levie <lars@realgeeks.com>

const got = require('got');

const mackHost = process.env.MACK_HOST;
const mackApiToken = process.env.MACK_API_KEY;
const validSlug = '([-_\\.0-9a-z]+)';
const prefix = 'unstable-kdeploy';

const deploySyntax = new RegExp(
  [
    `(${prefix}(?:\\:[^\\s]+)?)\\s+`,
    validSlug, // application name, from apps.json
    '(?:\\/([^\\s]+))?', // Branch or sha to deploy, optional
    '(?:\\s+(?:to|in|on)\\s+', // http://i.imgur.com/3KqMoRi.gif, optional
    validSlug, // target to release to, optional
    '(?:\\/([^\\s]+))?)?', // target qualifier, optional
    '(?:\\s+)?$', // must not contain additional directives
  ].join(''),
  'i',
);

module.exports = (robot) => {
  // hubot kdeploy mack/master to am1
  robot.respond(deploySyntax, async (msg) => {
    const name = msg.match[1];
    const ref = msg.match[2];
    const target = msg.match[3];

    const user = robot.brain.userForId(msg.envelope.user.id);
    const room = robot.adapter.client.rtm.dataStore.getChannelGroupOrDMById(msg.message.user.room)
      .name;

    try {
      await got.post('/deployments', {
        baseUrl: mackHost,
        headers: {
          Authorization: `Bearer ${mackApiToken}`,
          'Content-Type': 'application/json',
        },
        json: true,
        timeout: 5000,
        body: {
          name,
          source: {
            type: 'git',
            configRepositoryUrl: 'git@github.com:RealGeeks/geekstack.git',
            configRepository: 'realgeeks/geekstack',
            configBranch: 'test-mack',
            repository: 'realgeeks/mack',
            branch: ref || 'master',
          },
          config: {
            target: target || 'am1',
            strategy: 'kubernetes/kustomize',
            path: 'kube-config/infra/mack',
            imageName: `558529356944.dkr.ecr.us-east-1.amazonaws.com/${name}`,
          },
          notify: {
            adapter: 'slack',
            room,
            user,
            userName: user.name,
          },
        },
      });

      msg.reply("Ok, I'm working on your deploy.");
    } catch (err) {
      msg.reply("Looks like I'm kaving trouble.");
    }
  });
};
