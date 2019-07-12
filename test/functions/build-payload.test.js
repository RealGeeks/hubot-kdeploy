const { expect } = require('chai');
const buildPayload = require('../../src/functions/build-payload');

describe('build-payload', () => {
  const validArgs = {
    name: 'basic',
    target: 'am1',
    ref: 'production',
    adapter: '',
    room: '',
    user: {},
  };

  it('Throws if app is missing', () => {
    const args = Object.assign({}, validArgs, { name: 'missingApp' });

    expect(() => buildPayload(args), args).to.throw('Config for missingApp: missing or malformed');
  });

  it('Assumes master if ref missing and defaultBranch unset', () => {
    const args = Object.assign({}, validArgs);
    delete args.ref;

    const payload = buildPayload(args);

    expect(payload.source.ref).to.eql('master');
  });

  it('Uses ref if provided', () => {
    const args = Object.assign({}, validArgs);
    const payload = buildPayload(args);

    expect(payload.source.ref).to.eql('production');
  });

  it('Uses defaultBranch if set and ref missing', () => {
    const args = Object.assign({}, validArgs, { name: 'withDefaults' });

    delete args.ref;

    const payload = buildPayload(args);

    expect(payload.source.ref).to.eql('foobar');
  });
});
