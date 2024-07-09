import YumiSign from 'yumisign';
import assert from 'assert';

const yumisign = new YumiSign();

async function main() {
  try {
    await yumisign.envelopes.retrieve('env_1');
  } catch (err) {
    assert(err instanceof yumisign.errors.YumiSignError);
    assert(err.type === 'YumiSignError');
    assert(err.message.match(/OAuth token not defined/));
    console.log('✅ A logic error occurred', err.message);
  }
}

main();
