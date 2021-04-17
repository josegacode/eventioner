const { GoogleSpreadsheet } = require('google-spreadsheet');

// Gettings the auth keys for Google API
const credentials = require('./json/credentials.json');

const spreadsheetId = '1rVFyNJ_rvexF-YcC38i0YU1CYZV76AM9BpdXWt0ynpA';

// Template for get basic doc info
const accessToSpreadsheet = async () => {
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  console.log(sheet);
}

// Template to get some value from sheet
const getValue = async () => {
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  const rows = await sheet.getRows();
  console.log(`# rows: ${rows.length}\n mentorKey: ${rows[0].mentorKey}`);
}

// Template to get some value from sheet
const validateMentorCode = async (mentorCode) => {
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  //const rows = await sheet.getRows();
  const columns = await sheet.getColumns();

  // Iterate over rows
  //console.log(`# rows: ${rows.length}\n mentorKey: ${rows[0].mentorKey}`);
}

// Register the accessToSpreadsheet funcion
// in the module's exports
module.exports = {
  accessToSpreadsheet: accessToSpreadsheet,
}
