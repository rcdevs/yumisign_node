#!/usr/bin/env -S npm run-script run

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as http from 'http';
import env from 'dotenv';
import {createHmac} from 'crypto';

const path = process.argv[3];

if (!path || !fs.statSync(path)) {
  console.error('Please specify the test application path');
  process.exit(1);
}

child_process.execSync('npm install', {
  cwd: path,
});

const server = child_process.exec('./index.ts', {
  cwd: path,
});

server.stdout?.pipe(process.stdout);
server.stderr?.pipe(process.stdout);

const serverUriPromise = new Promise<string>((resolve, reject) => {
  server.stdout?.on('data', (data) => {
    const match = /Webhook endpoint available at (.*)/gm.exec(data);
    if (match) {
      resolve(match[1]);
    }
  });
  server.on('error', (m) => reject(m));
  server.on('exit', (m) => reject(m));
});

// Use server .env file
env.config({
  path: `${path}/.env`,
});

// @ts-ignore
const webhookSecret: string = process.env.YUMISIGN_WEBHOOK_SECRET;

const generateHeader = (payload: string): string => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${payload}`, 'utf8')
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
};

const sendRequest = async (uri: string): Promise<string> => {
  const payload = JSON.stringify({id: 'env_1'});
  const signature = generateHeader(payload);

  return new Promise<string>((resolve, reject) => {
    const request = http.request(
      uri,
      {
        method: 'POST',
        headers: {
          'YumiSign-Signature': signature,
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        const chunks: any[] = [];
        res.on('data', (d) => {
          chunks.push(d);
        });
        res.on('end', () => {
          resolve(Buffer.concat(chunks).toString());
        });
        res.on('error', (e) => reject(e));

        if (res.statusCode != 200) {
          reject(new Error('Non 200 status code'));
        }
      }
    );
    request.write(payload);
    request.end();
  });
};

const main = async (): Promise<void> => {
  try {
    console.log('Waiting for server to be ready');
    const serverUri = await serverUriPromise;
    console.log(`Server ready at ${serverUri}`);
    const response = await sendRequest(serverUri);
    if (response != '{"received":true}') {
      throw new Error(`Unexpected response ${response}`);
    }
    console.log('Test succeeded');
    process.exit(0);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    server.kill();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
