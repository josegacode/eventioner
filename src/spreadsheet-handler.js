const { GoogleSpreadsheet } = require('google-spreadsheet');

// Gettings the auth keys for Google API
const credentials = require('./json/credentials.json');
//const config = require('./json/config');
let config = require('./json/config');

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
const saveMentorEmail = async (spreadsheetId, email, cellId) => {
  //serviceAccountLoginCheck(spreadsheetId);
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();

  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells('A:A');
  //const cellA1 = sheet.getCell(0, 1);
  const cell = sheet.getCellByA1(cellId);
  cell.value = email;
  sheet.saveUpdatedCells()

  let nextRow = config.spreadsheets.mentors.nextRowAvailable;
  // Updates next row available
  Number.parseInt(nextRow);
  console.log(`nextRowAvailable: ${nextRow}, ${typeof nextRow}`);
  console.log(`nextRowAvailable: ${nextRow}, ${typeof nextRow}`);
  //nextRowAvailable++;
}

// Template to get some value from sheet
const validateMentorCode = async (mentorCode) => {
  const sheet = document.sheetsByIndex[0];
  //const rows = await sheet.getRows();
  const columns = await sheet.getColumns();

  // Iterate over rows
  //console.log(`# rows: ${rows.length}\n mentorKey: ${rows[0].mentorKey}`);
}

// Register the accessToSpreadsheet funcion
// in the module's exports
module.exports = {
  login: login,
  saveMentorEmail: saveMentorEmail,
}
