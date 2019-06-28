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
const _ = require('lodash');
const buildPayload = require('../functions/build-payload');
const config = require('../config');

const mackHost = process.env.HUBOT_KDEPLOY_MACK_HOST;
const mackApiToken = process.env.HUBOT_KDEPLOY_MACK_API_KEY;
const validSlug = '([-_\\.0-9a-z]+)';
const prefix = 'unstable-kdeploy';

const deploySyntax = new RegExp(
  [
    `(${prefix}(?:\\:[^\\s]+)?)\\s+`,
    validSlug, // application name, from kdeploy.config.json
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
    const name = msg.match[2];

    if (_.includes(['list'], name)) return;

    const ref = msg.match[3];
    const target = msg.match[4];
    const adapter = robot.adapterName;

    const user = robot.brain.userForId(msg.envelope.user.id);
    const { room } = msg.message.user;

    let payload;

    try {
      payload = buildPayload({
        adapter,
        name,
        ref,
        room,
        target,
        user,
      });
    } catch (err) {
      msg.reply(`The config for \`${name}\` is missing or broken.`);
      robot.logger.error(err);
      return;
    }

    try {
      await got.post('/deployments', {
        baseUrl: mackHost,
        headers: {
          Authorization: `Bearer ${mackApiToken}`,
          'Content-Type': 'application/json',
        },
        json: true,
        timeout: 5000,
        retry: 0,
        body: payload,
      });

      msg.reply("Ok, I'm working on your deploy.");
    } catch (err) {
      robot.logger.error(err);
      msg.reply("Looks like I'm kaving trouble.");
    }
  });

  robot.respond(new RegExp(`(${prefix})\\s+(list)`), (msg) => {
    const deployables = _.map(config.apps, app => `${app.name} to [${app.targets.join(', ')}]`);

    msg.reply('Here are the apps I can deploy: ', ...deployables);
  });
};
