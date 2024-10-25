/**
 * Created by Xingheng on 8/15/16.
 */
const Request   = require('superagent');
import {objectToQueryString} from './helpers';
var moment = require('moment');
moment().format();

function convertAuth0Event(auth0Domain, event) {
  const rootAuth0Url = `https://${auth0Domain}`;
  const reconstructURI = (root, path, query) => {
    return root + path + '?' + objectToQueryString(query);
  };

  switch(event.type) {
    case 'sapi':
    case 'fapi':
      const eventRequest = event.details.request;
      const eventResponse = event.details.response;
      const isUserRoute = /users/.test(eventRequest.path)
        && (['POST', 'PATCH', 'PUT'].indexOf(eventRequest.method.toUpperCase() > -1));
      return {
        request: {
          time: moment.utc(event.date).toISOString() ,
          uri: reconstructURI(rootAuth0Url, eventRequest.path, eventRequest.query),
          verb: eventRequest.method.toUpperCase(),
          headers: event.details.headers || { 'User-Agent': event.user_agent},
          api_version: "v2",
          ip_address: event.ip,
          body: eventRequest.body
        },
        response: {
          time: moment.utc(event.date).add(100, 'ms').toISOString(),
          status: eventResponse.statusCode,
          headers: {},
          body: eventResponse.body
        },
        'session_token': event.user_id,
        'tags': isUserRoute ? 'user' : undefined,
        'user_id': event.user_id
      };
    case 'ss':
      // request username
      return null;
    default:
      return null;
  }
}

export function postEventsToMoesif(auth0Domain, moesifAppId, events) {
  const transformedEvents = events.map(e => convertAuth0Event(auth0Domain, e)).filter(ev => ev !== null);

  if (transformedEvents.length) {
    return Request.post('https://api.moesif.net/v1/events/batch')
      .send(transformedEvents)
      .type('application/json')
      .set('X-Moesif-Application-Id', moesifAppId)
  }
  return {
    end: (callback) => { return undefined; }
  };
}
