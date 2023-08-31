#!/usr/bin/env -S npm run-script run

import YumiSign from 'yumisign';

const yumisign = new YumiSign();

async function main() {
  try {
    await yumisign.envelopes.retrieve('env_1');
  } catch (err) {
    if ((err as Error).message.match(/OAuth token not defined/)) {
      console.log('✅ A logic error occurred', (err as Error).message);
    } else {
      throw err;
    }
  }
}

main();
