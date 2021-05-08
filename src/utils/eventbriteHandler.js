// Holds the private token of eventbrite
const { token, eventId } = require('../json/eventbriteCredentials.json');
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

const getAttendeeByTicket = (ticketId) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}events/${eventId}/attendees/?${OAuth}`)
      // Destructs an attendee
      .then(response => response.json())
      .then(eventInfo => {
        //console.log(eventInfo);
        const { attendees } = eventInfo;
        //console.log(attendees);
        return attendees;
      }) 

      // Check if the attendee exists
      .then(attendees => {
        console.log(attendees);
        console.log(ticketId);
        resolve(attendees.find(attendee => attendee.order_id == ticketId))
      })
  })
}

const retrieveEventInformation = (ticketId) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}events/${eventId}/attendees/?${OAuth}`)
      .then(response => resolve(response.json()))
  })
    
}

/*
const validateAttendee = (ticketId) async => {

}
*/

module.exports = {
  ping: auth,
  validateAttendee: retrieveEventInformation,
  getAttendeeByTicket: getAttendeeByTicket,
}
