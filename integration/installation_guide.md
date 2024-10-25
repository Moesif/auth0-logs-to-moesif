Deploy this integration to ship Auth0 events from your Auth0 account to Moesif using custom log stream via webhooks.

## Prerequisites

1. An Auth0 account and tenant. [Sign up for free](https://auth0.com/signup).
2. A Moesif account [Sign up for free](https://www.moesif.com)

## Set up Moesif

To configure the integration with Moesif:

1. Create a Moesif Account if you haven't done so.
2. Obtain your MOESIF APPLICATION ID through onboarding steps or under **Settings > Installation**.

## Setup & Deploy Webhook Service

Copy the folder `log-streams-webhook` from github repo [https://github.com/Moesif/auth0-logs-to-moesif](https://github.com/Moesif/auth0-logs-to-moesif) to your local drive. To verify if your can run the webhook.

```shell
$ npm install # If running yourself
added XX packages from XX contributors in XX.XXs

$ npm start # If running yourself
Listening on port 3050

# Replace the Authorization header below with MOESIF_APPLICATION_ID
$ curl \
  --header "Authorization: MOESIF_APPLICTION_ID" \
  --header "Content-Type: application/json" \
  --request POST \
  --data '[{"data": {"type": "f", "description": "Test failure", "log_id": "abc1234567890", "user_id": "testuser" }}]' \
  http://localhost:3050/logs

```

Above should verify you are able to run the webhook, and see the event in your Moesif account.

Deploy the webhook to a cloud service of your choice, and obtain the `host domain`.

## Add the Auth0 Custom Webhook Stream

1. In your Auth0 Dashboard, navigate to **Monitoring > Streams**, and select **Create Stream**.
1. From the **New Event Stream** listing, select **Custom Webhook**.
1. Enter a **Name**, and select **Create**.
1. Locate the **Payload URL** field, and enter `https://[host domain]/logs`.
1. For Authorization Token: use your MOESIF_APPLICATION_ID.
1. Locate the **Content Type** field, and select "application/json".
1. Locate the **Content Format** field, and select "JSON Array".
1. Save the changes and create the stream by selecting **Save**.

## Trouble Shoot

### In Auth0 check your data:

1. Check the Dashboard **Logs > Search** screen to make sure the record is there.
2. Check **Health** tab for stream and delivery attemped.

### In Moesif check your data:

1. Go to your [Moesif Account](http://www.moesif.com)
2. Click on **Start New -> Event Stream** and verify the Auth0 event arrives.

### Check for errors in your deployed webhook:

1. Set `DEBUG = true` in to see `console.log` to verify
   1. If your webhook service is receiving events from Auth0.
   2. If there is error transforming and sending events to Moesif.
