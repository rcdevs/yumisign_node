# YumiSign Library

The YumiSign Node library provides convenient access to the YumiSign API from
applications written in JavaScript.

## Requirements

Node 12 or higher.

## Installation

Install the package with:

```sh
npm install yumisign --save
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

| Parameter         | Required | Default                    | Description                                                   |
|-------------------|----------|----------------------------|---------------------------------------------------------------|
| `clientId`        | True     | No default value           | Your YumiSign integration app client id                       |
| `clientSecret`    | True     | No default value           | Your YumiSign integration app client secret                   |
| `baseUri`         | False    | `https://app.yumisign.com` | Base uri of YumiSign website                                  |
| `oAuthTokenStore` | False    | Local storage              | A store object used to fetch save and remove your oauth token |
