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

const getAttendees = async => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}events/${eventId}/attendees/?${OAuth}`)
      .then(response => resolve(response.json()))
  })
}

const getAttendeesPage = async (pageNumber) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}events/${eventId}/attendees/?page=${pageNumber}&${OAuth}`)
      .then(response => resolve(response.json()))
  })
}

const validateTicket = async (ticketId) => {
    // First call api
    fetch(`${API_URL}events/${eventId}/attendees/${OAuth}`)
      .then(firstCall => {

        // First api response object
        const { attendees } = firstCall;
        console.log(`First response ${attendees}`);

        // Check if there is more pages
        if(!firstResponse.pagination.has_more_items) {
          console.log('there is one page only');

          // If not: Check if there is ticketid in the current page and return
          const foundInFirstResponse = firstResponse.attendees.find(attendee => attendee.order_id == ticketId);
          console.log(`found in first page only: ${foundInFirstResponse}`);

          // Was found in the unique one page
          if(foundInFirstResponse == undefined) resolve(true);

          // Wasn't found in the unique first page
          else resolve(false);
        } else {
          console.log('There is more pages');
          let foundInPagination = false;
          let moreItems = true;
          let continuationToken = firstResponse.pagination.continuation;

          // iterate over reach end page or found ticket exists
          while(!foundInPagination || moreItems) {
            console.log('call =>');
            fetch(`${API_URL}events/${eventId}/attendees/?continuation=${continuationToken}`)
              .then(iterativeResponse => {
                const paginationResult = iterativeResponse.json();
                const foundInResponse = paginationResult.attendees.find(attendee => attendee.order_id == ticketId);
                console.log(`foundInRespone: ${foundInResponse}`);

                if(foundInResponse != undefined) {
                  foundInPagination = true;
                  console.log(`FOUND: ${foundInResponse}`)
                }

                moreItems = response.pagination.has_more_items;
                continuationToken = paginationResult.pagination.continuation;
              })
          }
          console.log(`after while`);
          
          if(foundInPagination) resolve(true);
          else resolve(false);
        } // iterative calls
      })
}

module.exports = {
  ping: auth,
  validateTicket: validateTicket,
  getAttendees: getAttendees,
  getAttendeesPage: getAttendeesPage,
}
