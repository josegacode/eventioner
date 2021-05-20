// Holds the private token of eventbrite
const { token, reduxId} = require('../json/eventbriteCredentials.json');
//const axios = require('axios');
const fetch = require('node-fetch');
//const {response} = require('express');
const API_URL = 'https://www.eventbriteapi.com/v3/';
const OAuth = `token=${token}`;
const eventId = reduxId;

/**
  * Gets all available or coming soong (live)
  * events from Redux agro organization.
  *
  * @param pageNumber The index of paginated response that we want to retrieve
  * */
const getAvailableEvents = async => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}organizations/450438898208/events/?status=live&${OAuth}`)
      .then(response => resolve(response.json()))
      .catch(error => reject(error))
  })
}

/**
  * Gets a paginated response
  *
  * @param pageNumber The index of paginated response that we want to retrieve
  * */
const getAttendees = async => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}events/${eventId}/attendees/?${OAuth}`)
      .then(response => resolve(response.json()))
  })
}

/**
  * For paginated responses, this function
  * lets get a specific page by its index.
  *
  * @param pageNumber The index of paginated response that we want to retrieve
  * */
const getAttendeesPage = async (pageNumber) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}events/${eventId}/attendees/?page=${pageNumber}&${OAuth}`)
      .then(response => resolve(response.json()))
  })
}

const getAttendeesTickets = () => {
  return new Promise((resolve, rejected) => {

    fetch(`${API_URL}events/${eventId}/attendees/?${OAuth}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // Store all attendees
        let apiCalls = [];

        // Gets all orders from all pages
        for(let page = 1; page <= data.pagination.page_count; page++) {
          apiCalls.push(getAttendeesPage(page))
        }

        Promise.all(apiCalls)
          .then(allPages => resolve(allPages)) // .all 
        }) // first call
      .catch(error => console.error(error));
  })
}

module.exports = {
  getAttendees: getAttendees,
  getAttendeesPage: getAttendeesPage,
  getAttendeesTickets: getAttendeesTickets,
  getAvailableEvents: getAvailableEvents
}
