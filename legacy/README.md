NOTE:

This web tasks app is deprecated, because Auth0 is moving to custom log stream webhook model. https://auth0.com/docs/customize/log-streams/custom-log-streams

We create a webhook app that translate Auth0 Event Stream to [Moesif Action](https://www.moesif.com/docs/getting-started/user-actions/).

See [log-streams-webhooks](/log-streams-webhook/) for a minimal webhook app to transform data to Moesif Action Event and send to Moesif.


# Auth0 - Logs to Moesif

## One Click Install for Auth0

[![Auth0 Extensions](https://cdn.auth0.com/extensions/assets/badge.svg)](https://sandbox.it.auth0.com/api/run/auth0-extensions/extensions-badge?webtask_no_cache=1)

This extension will send/export your Auth0 API logs and end-user profiles to Moesif.

1. You may have to click the orange _Create Extension_ button and then enter the following GitHub Url: [https://github.com/Moesif/auth0-logs-to-moesif](https://github.com/Moesif/auth0-logs-to-moesif)

2. Enter your MOESIF_APPLICATION_ID. You can find your Application Id from [_Moesif Dashboard_](https://www.moesif.com/wrap) -> _Top Right Menu_ -> _Extensions Setup_ -> _Auth0 Extension_

3. That's it! You should see your Auth0 logs show up in Moesif shortly.

## Manual Install

### Configure Webtask
__For those who require a manual/local install outside of the Auth0 environment__

If you haven't configured Webtask on your machine run this first:

```
npm i -g wt-cli
wt init
```

> Requires at least node 0.10.40 - if you're running multiple version of node make sure to load the right version, e.g. "nvm use 0.10.40"

### Deploy to Webtask.io

To run it on a schedule (run every 5 minutes for example):

```bash
$ npm run build
$ wt cron schedule \
    --name auth0-logs-to-moesif \
    --secret AUTH0_DOMAIN="YOUR_AUTH0_DOMAIN" \
    --secret AUTH0_CLIENT_ID="YOUR_AUTH0_GLOBAL_CLIENT_ID" \
    --secret AUTH0_CLIENT_SECRET="YOUR_AUTH0_GLOBAL_CLIENT_SECRET" \
    --secret LOG_LEVEL="1" \
    --secret LOG_TYPES="s,f" \
    --secret MOESIF_APPLICATION_ID="MOESIF_APPLICATION_ID" \
    "*/5 * * * *" \
    ./build/bundle.js
```


The following settings are optional:

 - `LOG_LEVEL`: This allows you to specify the log level of events that need to be sent.
 - `LOG_TYPES`: If you only want to send events with a specific type (eg: failed logins). This needs to be a comma separated list.
 - `MOESIF_APPLICATION_ID`: Your subdomain at Moesif.

> You can get your Global Client Id/Secret here: https://auth0.com/docs/api/v1


### Filters

The `LOG_LEVEL` can be set to (setting it to a value will also send logs of a higher value):

 - `1`: Debug messages
 - `2`: Info messages
 - `3`: Errors
 - `4`: Critical errors

The `LOG_TYPES` filter can be set to:

- `s`: Success Login (level: 1)
- `seacft`: Success Exchange (level: 1)
- `feacft`: Failed Exchange (level: 3)
- `f`: Failed Login (level: 3)
- `w`: Warnings During Login (level: 2)
- `du`: Deleted User (level: 1)
- `fu`: Failed Login (invalid email/username) (level: 3)
- `fp`: Failed Login (wrong password) (level: 3)
- `fc`: Failed by Connector (level: 3)
- `fco`: Failed by CORS (level: 3)
- `con`: Connector Online (level: 1)
- `coff`: Connector Offline (level: 3)
- `fcpro`: Failed Connector Provisioning (level: 4)
- `ss`: Success Signup (level: 1)
- `fs`: Failed Signup (level: 3)
- `cs`: Code Sent (level: 0)
- `cls`: Code/Link Sent (level: 0)
- `sv`: Success Verification Email (level: 0)
- `fv`: Failed Verification Email (level: 0)
- `scp`: Success Change Password (level: 1)
- `fcp`: Failed Change Password (level: 3)
- `sce`: Success Change Email (level: 1)
- `fce`: Failed Change Email (level: 3)
- `scu`: Success Change Username (level: 1)
- `fcu`: Failed Change Username (level: 3)
- `scpn`: Success Change Phone Number (level: 1)
- `fcpn`: Failed Change Phone Number (level: 3)
- `svr`: Success Verification Email Request (level: 0)
- `fvr`: Failed Verification Email Request (level: 3)
- `scpr`: Success Change Password Request (level: 0)
- `fcpr`: Failed Change Password Request (level: 3)
- `fn`: Failed Sending Notification (level: 3)
- `limit_wc`: Blocked Account (level: 4)
- `limit_ui`: Too Many Calls to /userinfo (level: 4)
- `api_limit`: Rate Limit On API (level: 4)
- `sdu`: Successful User Deletion (level: 1)
- `fdu`: Failed User Deletion (level: 3)

So for example, if I want to filter on a few events I would set the `LOG_TYPES` filter to: `sce,fce,scu,fcu`.

## Issue reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker.

## What is Moesif?

Moesif helps you to:

* Make Debugging __REST APIs__ and Integrated Apps Easier.
Moesif's hosted service is built to log and analyze millions of API requests so you can stay focused on your customer experience.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
