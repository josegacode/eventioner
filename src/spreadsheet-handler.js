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
const saveMentorEmail = async (spreadsheetId, email) => {
  //serviceAccountLoginCheck(spreadsheetId);
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();

  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells('A:A');
  //console.log(`DEBUG: ${typeof sheet.cellStats.nonEmpty}, `);
  //const cellA1 = sheet.getCell(0, 1);
  //const cellToWrite = `A`
  //par
  
  // Getting the next cell available
  const cell = sheet.getCellByA1(`A${sheet.cellStats.nonEmpty + 1}`);

  // Assings the value to be set in which cell
  cell.value = email;

  // Write the changes in the doc
  await sheet.saveUpdatedCells()

  //let nextRow = config.spreadsheets.mentors.nextRowAvailable;
  // Updates next row available
  //Number.parseInt(nextRow);
  //console.log(`nextRowAvailable: ${nextRow}, ${typeof nextRow}`);
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
