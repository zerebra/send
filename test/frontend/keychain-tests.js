import assert from 'assert';
import Keychain from '../../app/keychain';

describe('Keychain', function() {
  it('does', function() {
    const k = new Keychain();
    assert.equal(k.nonce, 'yRCdyQ1EMSA3mo4rqSkuNQ==');
  });
});
