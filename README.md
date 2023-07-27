# YumiSign Library

The YumiSign Node library provides convenient access to the YumiSign API from
applications written in JavaScript.

## Requirements

Node 12 or higher.

## Installation

Install the package with:

```sh
npm install yumisign git+https://github.com/rcdevs/yumisign_node --save
```

## Usage

The package needs to be configured with the corresponding
YumiSign integration app client id and secret.

```js
const yumisign = require('yumisign')({
  clientId: 'client_id',
  clientSecret: 'client_secret',
});

yumisign.workspaces.list()
  .then(workspaces => console.log(workspaces))
  .catch(error => console.error(error));
```

Or using ES modules and `async`/`await`:

```js
import YumiSign from 'yumisign';
const yumisign = new YumiSign({
  clientId: 'client_id',
  clientSecret: 'client_secret',
});

const workspaces = await yumisign.workspaces.list();
console.log(workspaces);
```

## Usage with TypeScript

```ts
import YumiSign from 'yumisign';

const yumisign = new YumiSign({
  clientId: 'client_id',
  clientSecret: 'client_secret',
});

const getWorkspaces = async () => {
  const workspaces: YumiSign.Workspace[] = await yumisign.workspaces.list();
  console.log(workspaces);
};
getWorkspaces();
```

### Using Promises

Every method returns a chainable promise which can be used instead of a regular callback:

```js
yumisign.workspaces
  .list()
  .then((workspaces) => {
    // Add your custom logic here.
  })
  .catch((err) => {
    // Handle error.
  });
```

### Webhook signing

YumiSign can optionally sign the webhook events it sends to your endpoint, allowing you to validate that they were not sent by a third-party.
Please note that you must pass the _raw_ request body, exactly as received from YumiSign, to the `constructEvent()` function; this will not work with a parsed (i.e., JSON) request body.
You can find the YumiSign signature header in the request header as `YUMISIGN-SIGNATURE`.

```js
import YumiSign from 'yumisign';

const yumisign = new YumiSign();
const event = yumisign.webhooks.constructEvent(
  rawBody,
  signatureHeader,
  webhookSecret
);
```

## Configuration

The package can be initialized with several configurations:

```js
const yumisign = YumiSign({
  clientId: 'client_id',
  clientSecret: 'client_secret',
  baseUri: 'https://app.yumisign.com',
  oAuthTokenStore: {
    get: () => {
      // Return the stored oauth token if exist
    },
    set: (oAuthToken) => {
      // Save the oauth token in your store
    },
    del: () => {
      // Remove the stored oauth token if exist
    }
  }
});
```

| Parameter         | Required | Default                    | Description                                                             |
|-------------------|----------|----------------------------|-------------------------------------------------------------------------|
| `clientId`        | False    | No default value           | Your YumiSign integration app client id (Required for api requests)     |
| `clientSecret`    | False    | No default value           | Your YumiSign integration app client secret (Required for api requests) |
| `baseUri`         | False    | `https://app.yumisign.com` | Base uri of YumiSign website                                            |
| `oAuthTokenStore` | False    | Local storage              | A store object used to fetch save and remove your oauth token           |
