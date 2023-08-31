import * as childProcess from 'child_process';

const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);
describe('Samples', function() {
  this.timeout(50000);

  const run = (command: string): Promise<void> => {
    const process = childProcess.exec(command);

    let out = '';
    process.stdout?.on('data', (chunk) => {
      out += chunk;
    });
    process.stderr?.on('data', (chunk) => {
      out += chunk;
    });

    return new Promise((resolve, reject) => {
      process.on('exit', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Test failed: ' + out));
        }
      });
    });
  };

  describe('App', () => {
    const appTestCase = (appName: string): Promise<void> => {
      return run(`
        cd samples/app/${appName} &&
        rm -rf node_modules &&
        npm install &&
        npm run lint &&
        npm run-script run
      `);
    };

    it('Should work with CommonJS', () => {
      return appTestCase('cjs');
    });

    it('Should work with Javascript ESModule', async function() {
      if (nodeVersion < 13) {
        console.log(
          `App test skipped. Node version >=13 required, actual ${nodeVersion}.`
        );
        this.skip();
      }
      await appTestCase('esm-js');
    });

    it('Should work with Typescript ESModule', async function() {
      if (nodeVersion < 13) {
        console.log(
          `App test skipped. Node version >=13 required, actual ${nodeVersion}.`
        );
        this.skip();
      }
      await appTestCase('esm-ts');
    });
  });

  describe('Webhook', () => {
    const webhookTestCase = (serverName: string): Promise<void> => {
      if (nodeVersion < 14) {
        console.log(
          `Webhook test skipped. Node version >=14 required, actual ${nodeVersion}.`
        );
        return Promise.resolve();
      }

      return run(`
        (
          cd samples/webhook/server/${serverName} &&
          rm -rf node_modules &&
          npm install &&
          npm run lint
        ) &&
        (
          cd samples/webhook/client/test &&
          rm -rf node_modules &&
          npm install &&
          ./index.ts ../../server/${serverName}
        )
      `);
    };

    it('Should work on express', () => {
      return webhookTestCase('express');
    });
  });
});
