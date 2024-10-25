const axios = require("axios");

const moesifActionBatchEndpoint = `https://api.moesif.net/v1/actions/batch`;

module.exports = async (moesifApplicationId, auth0Events) => {
  // transform event id
  // https://auth0.com/docs/deploy-monitor/logs/log-event-type-codes
  // [
  // { "log_id": "",  "data": { "date": "2020-01-29T17:26:50.193Z", "type": "sapi", "description": "Create a log stream", "client_id": "", "client_name": "", "ip": "", "user_agent": "", "user_id": "", "log_id": "" }},
  // { "log_id": "",  "data": { "date": "2020-01-29T17:26:50.193Z", "type": "sapi", "description": "Create a log stream", "client_id": "", "client_name": "", "ip": "", "user_agent": "", "user_id": "", "log_id": "" }}
  // ]
  // to moesif Action https://www.moesif.com/docs/api#actions
  const moesifActionEvents = auth0Events.map((item) => {
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

  return axios.post(moesifActionBatchEndpoint, moesifActionEvents, {
    "Content-Type": "application/json",
    "X-Moesif-Application-Id": moesifApplicationId,
  });
};
