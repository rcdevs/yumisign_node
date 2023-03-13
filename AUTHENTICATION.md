# YumiSign Authentication

## Usage with React
```tsx
import { useEffect, useRef, useState } from 'react';
import YumiSign from 'yumisign';

const { current: yumisign } = useRef(new YumiSign({
    clientId: 'client_id',
    clientSecret: 'client_secret',
}));

const code = undefined; // Retrieve the code send by YumiSign after authorize redirection.
const state = ''; // Your custom state used during authorize process.
const redirectUri = 'https://my-app.com/oauth/authorize/redirect'; // Your custom redirect uri.
const authUrl = yumisign.oauth.authorizeUri({ redirectUri, state });
const [hasOAuthToken, setHasOAuthToken] = useState<boolean>(yumisign.oauth.hasToken());

useEffect(() => {
    if (!hasOAuthToken) {
        yumisign.oauth.findStoredToken()
            .then((oAuthToken) => {
                if (oAuthToken) {
                    setHasOAuthToken(true);
                } else if (code) {
                    yumisign.oauth.access({ redirectUri, code })
                        .then(() => setHasOAuthToken(yumisign.oauth.hasToken()));
                }
            });
    }
}, [code, hasOAuthToken]);

return (
    !hasOAuthToken ? (
        <a href={authUrl}>Sign in</a>
    ) : (
        <h1>Welcome!</h1>
    )
);
```
