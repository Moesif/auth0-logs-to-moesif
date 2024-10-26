

## HookDeck Data Transformation Webhook Forwarding.


If you do not want to deploy your own webhook, you can also leverage one of the many webhook forwarding/transformation service, such as [HookDeck](https://hookdeck.com), which offers a very generous free quota. Here are set up instructions.


### Setup destination

```
POST https://api.moesif.net/v1/actions/batch
```

### And transformation of request, just add below code:

```javascript
addHandler('transform', (request, context) => {
  // Transform the request object then return it.
  const moesifActionEvents = request.body.map((item) => {
    const action = {
      action_name: `${item.data.type}|auth0`,
      user_id: item.data.user_id,
      transaction_id: item.data.log_id,
      request: {
        ip: item.data.ip,
        uri: `https://${process.env.AUTH0DOMAIN || "www"}.auth0.com`,
        time: item.data.date,
        user_agent_string: item.data.user_agent,
      },
      metadata: {
        description: item.data.description,
        client_id: item.data.client_id,
        client_name: item.data.client_name,
      },
    };

    return action;
  });

  // modify the authorization header from Auth0 to `X-Moesif-Application-ID`.
  request.headers['X-Moesif-Application-Id'] = request.headers['authorization'];
  request.body = moesifActionEvents;

  return request;
});
```
