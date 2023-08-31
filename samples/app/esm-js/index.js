import YumiSign from 'yumisign';

const yumisign = new YumiSign();

async function main() {
  try {
    await yumisign.envelopes.retrieve('env_1');
  } catch (err) {
    if (err.message.match(/OAuth token not defined/)) {
      console.log('✅ A logic error occurred', err.message);
    } else {
      throw err;
    }
  }
}

main();
