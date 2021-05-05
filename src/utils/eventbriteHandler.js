// Holds the private token of eventbrite
const eventbriteCredentials = require('../json/eventbriteCredentials.json');
const axios = require('axios');
const API_URL = 'https://www.eventbriteapi.com/v3/';

const auth = () => {
  axios.get(`${API_URL}users/me/`, {
    params: {
      token: eventbriteCredentials.token
    }
  })
    .then(response => {
      console.log(`AXIOS RESPONSE: ${response.data.emails[0].email}`)
    })
    .catch(error => console.log(error));
}

const retrieveEventInformation = (eventId) => {
  console.log(`request ${eventId}, ${API_URL}`);
  axios.get(`${API_URL}events/`, {
    params: {
      event_ids: eventId,
      token: eventbriteCredentials.token
    }
  })
    .then(response => {
      console.log(`AXIOS RESPONSE: ${response.data.events[0].name.text}`)
    })
    .catch(error => console.log(error));
}

/*
const validateAttendee = (ticketId) async => {

}
*/

module.exports = {
  ping: auth,
  retrieveEventInformation: retrieveEventInformation,
}
