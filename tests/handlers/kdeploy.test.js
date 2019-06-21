const Helper = require('hubot-test-helper');
const chai = require('chai');
const nock = require('nock');

const { expect } = chai;

const helper = new Helper('../../src/handlers/kdeploy.js');

nock('https://mack.stg.rg-infra.com')
  .post('/deployments', {})
  .reply(200, {});

describe('kdeploy', () => {
  beforeEach(() => {
    this.room = helper.createRoom();
  });

  afterEach(() => {
    this.room.destroy();
  });

  it('responds to simple deploy', async () => {
    await this.room.user.say('alice', '@hubot kdeploy nameOfDeployable').then(() => {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot kdeploy nameOfDeployable'],
        ['hubot', '@alice hello!'],
      ]);
    });
  });

  it('responds to deploy with branch', async () => {
    await this.room.user.say('alice', '@hubot kdeploy nameOfDeployable/branch').then(() => {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot kdeploy nameOfDeployable/branch'],
        ['hubot', '@alice hello!'],
      ]);
    });
  });

  it('responds to simple deploy with branch and simple target', async () => {
    await this.room.user
      .say('alice', '@hubot kdeploy nameOfDeployable/branch to targetName')
      .then(() => {
        expect(this.room.messages).to.eql([
          ['alice', '@hubot kdeploy nameOfDeployable/branch to targetName'],
          ['hubot', '@alice hello!'],
        ]);
      });
  });

  it('responds to simple deploy with branch and target and subtarget', async () => {
    await this.room.user
      .say('alice', '@hubot kdeploy nameOfDeployable/branch to targetName/subTarget')
      .then(() => {
        expect(this.room.messages).to.eql([
          ['alice', '@hubot kdeploy nameOfDeployable/branch to targetName/subTarget'],
          ['hubot', '@alice hello!'],
        ]);
      });
  });
});
