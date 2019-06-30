const Helper = require('hubot-test-helper');
const chai = require('chai');
const nock = require('nock');

const { expect } = chai;

const helper = new Helper('../../src/handlers/kdeploy.js');
const prefix = 'kdeploy';

describe('kdeploy {appname}', () => {
  before(() => {
    nock(/\S*/, { encodedQueryParams: true })
      .persist()
      .post('/deployments')
      .reply(200);
  });

  after(() => {
    nock.restore();
  });

  beforeEach(() => {
    this.room = helper.createRoom();
  });

  afterEach(() => {
    this.room.destroy();
  });

  describe('{appname}', () => {
    it('responds to simple deploy', (done) => {
      this.room.user.say('alice', `@hubot ${prefix} mack`);

      setTimeout(() => {
        expect(this.room.messages).to.eql([['alice', `@hubot ${prefix} mack`]]);

        done();
      }, 50);
    });

    it('responds to deploy with branch', (done) => {
      this.room.user.say('alice', `@hubot ${prefix} mack/branch`);

      setTimeout(() => {
        expect(this.room.messages).to.eql([['alice', `@hubot ${prefix} mack/branch`]]);

        done();
      }, 50);
    });

    it('responds to simple deploy with branch and simple target', (done) => {
      this.room.user.say('alice', `@hubot ${prefix} mack/branch to am21`);

      setTimeout(() => {
        expect(this.room.messages).to.eql([['alice', `@hubot ${prefix} mack/branch to am21`]]);

        done();
      }, 50);
    });

    it('responds to simple deploy with branch and target and subtarget', (done) => {
      this.room.user.say('alice', `@hubot ${prefix} mack/branch to am21/subTarget`);

      setTimeout(() => {
        expect(this.room.messages).to.eql([
          ['alice', `@hubot ${prefix} mack/branch to am21/subTarget`],
        ]);
        done();
      }, 50);
    });
  });

  describe('list', () => {
    it('Lists all deployable apps', async () => {
      await this.room.user.say('alice', `@hubot ${prefix} list`).then(() => {
        expect(this.room.messages).to.eql([
          ['alice', `@hubot ${prefix} list`],
          ['hubot', '@alice Here are the apps I can deploy: '],
          ['hubot', '@alice mack to [am1, am21]'],
          ['hubot', '@alice basic to [am1, am21]'],
          ['hubot', '@alice withDefaults to [am1, am21]'],
        ]);
      });
    });
  });
});
