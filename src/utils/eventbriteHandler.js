// Holds the private token of eventbrite
const {token} = require('../json/eventbriteCredentials.json');
//const axios = require('axios');
const fetch = require('node-fetch');
const {response} = require('express');
const API_URL = 'https://www.eventbriteapi.com/v3/';
const OAuth = `token=${token}`;

const auth = () => {
  console.log(token)
  fetch(`${API_URL}users/me/?token=${token}`)
    .then(response => response.json())
    .then(apiOwnerData => console.log(apiOwnerData))
    .catch(error => console.log(error));
}

const retrieveEventInformation = (eventId, ticketId) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}events/${eventId}/attendees/?${OAuth}`)
      .then(response => resolve(response.json()))
    /*
      .then(responseJson => {
        const { attendees } = responseJson;
        //console.log(attendees);
        const profile = attendees.find(attendee => attendee.order_id == ticketId);
        //console.log(profile.profile);
        checkIn = profile != undefined ? true : false;
        console.log(`checkIn: ${checkIn}`);
        return checkIn;
      })
      .catch(error => console.log(error));
      */
  })
    
}

/*
const validateAttendee = (ticketId) async => {

}
*/

module.exports = {
  ping: auth,
  validateAttendee: retrieveEventInformation,
}
