#!/usr/bin/env -S npm run-script run

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import express from 'express';
import YumiSign from 'yumisign';
import env from 'dotenv';

env.config();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const webhookSecret: string = process.env.YUMISIGN_WEBHOOK_SECRET;

// Create YumiSign client
const yumisign = new YumiSign();

// Create Express app
const app = express();

// Use JSON parser for all non webhook routes
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  }
);

app.post(
  '/webhook',
  express.raw({type: 'application/json'}),
  (req: express.Request, res: express.Response): void => {
    let event: YumiSign.Event;

    try {
      event = yumisign.webhooks.constructEvent(
        req.body,
        req.headers['yumisign-signature'],
        webhookSecret
      );
    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error: ${(err as Error).message}`);
      res.status(400);
      res.json({error: (err as Error).message});
      return;
    }

    // On success, log and add your custom logic
    console.log('✅ Success: Event received');

    if (event.type === 'envelope.updated') {
      const envelope: YumiSign.Envelope = event.data
        .object as YumiSign.Envelope;
      console.log(`✉️  Envelope id: ${envelope.id}`);
    } else {
      console.warn(`🤷‍️ Unhandled event type: ${event.type}`);
    }

    // Return a response to notify event received successfully
    res.json({received: true});
  }
);

const server = app.listen();
console.log(
  `Webhook endpoint available at http://localhost:${
    server.address().port
  }/webhook`
);
