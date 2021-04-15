const { GoogleSpreadsheet } = require('google-spreadsheet');

// Gettings the auth keys for Google API
const credentials = require('./json/credentials.json');

const spreadsheetId = '1rVFyNJ_rvexF-YcC38i0YU1CYZV76AM9BpdXWt0ynpA';

const accessToSpreadsheet = async () => {
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth(credentials);
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  console.log(sheet);
}

accessToSpreadsheet();

// Register the accessToSpreadsheet funcion
// in the module's exports
module.exports = {
  accessToSpreadsheet: accessToSpreadsheet,
}
