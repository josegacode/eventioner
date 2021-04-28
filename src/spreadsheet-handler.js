const { GoogleSpreadsheet } = require('google-spreadsheet');

// Gettings the auth keys for Google API
const credentials = require('./json/credentials.json');
//const config = require('./json/config');
let config = require('./json/config');
const spreadsheets = require('./json/spreadsheets.json');

let document;

const login = async (spreadsheetId) => {
  // Template for get basic doc info
  document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();
}

const serviceAccountLoginCheck = (spreadsheetId) => {
  if(typeof document == 'undefined') {
    console.log(`Service account isn't logged, login in ...`);
    login(spreadsheetId);
    console.log(`Successfully login!`);
  } else return;
}

// Template to get some value from sheet
const saveMentorEmail = async (spreadsheetId, mentorData) => {
  console.log(`mentortype: ${mentorData.typeOfMentor}`)
  //serviceAccountLoginCheck(spreadsheetId);
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();

  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells('A:D');

  // Calculates the next row available considering
  // that each register or row has a group of M values (or columns), so
  // (N values / M) will returns the next
  // row available to write.
  const rowIndex = sheet.cellStats.nonEmpty / 
    spreadsheets.mentorsRegistration.columns;
  console.log(`DEBUG: ${rowIndex}`);

  //console.log(`DEBUG: ${typeof sheet.cellStats.nonEmpty}, `);
  const emailCell = sheet.getCell(rowIndex, 0);
  const usernameCell = sheet.getCell(rowIndex, 1);
  const typeOfMentorCell = sheet.getCell(rowIndex, 2);
  const serverCell = sheet.getCell(rowIndex, 3);

  // Assings the value to be set in which cell
  emailCell.value = mentorData.email;
  usernameCell.value = mentorData.username;
  typeOfMentorCell.value = mentorData.typeOfMentor;
  serverCell.value = mentorData.server;

  // Write the changes in the doc
  await sheet.saveUpdatedCells()
}

// Register the accessToSpreadsheet funcion
// in the module's exports
module.exports = {
  login: login,
  saveMentorEmail: saveMentorEmail,
}
