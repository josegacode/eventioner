import { GoogleSpreadsheet } from "google-spreadsheet";
// TODO: Paste your own Google API credentials here
//import credentials from "./json/credentials.json";
import { mentorsdb, mentorsRedux } from "./json/spreadsheets.json";

let document;

export const login = async (spreadsheetId) => {
  // Template for get basic doc info
  document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth('CREDENTIALS-HERE');
  await document.loadInfo();
};

export const serviceAccountLoginCheck = (spreadsheetId) => {
  if (typeof document == "undefined") {
    //console.log(`Service account isn't logged, login in ...`);
    login(spreadsheetId);
    //console.log(`Successfully login!`);
  } else return;
};

// Template to get some value from sheet
export const validateMentorEmail = async (mentorData) => {
  // Auth process with Google Spreadsheet API
  const document = new GoogleSpreadsheet(mentorsRedux.id);
  await document.useServiceAccountAuth('CREDENTIALS-HERE');
  await document.loadInfo();

  // Loading in cache the spreadsheets and cells
  // that we will use.
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells("B:B");

  // Calculates the next row available considering
  // that each register or row has a group of M values (or columns), so
  // (N values / M) will returns the next
  // row available to write.
  //  const rowIndex = sheet.cellStats.nonEmpty /  spreadsheets.mentorsRegistration.columns;

  // Fullfils the cache cells locally
  for (let i = 1; i <= sheet.cellStats.nonEmpty; i++) {
    let email = sheet.getCellByA1(`B${i}`);
    //console.log(email.value);
    if (email.value == mentorData) return true;
    else if (i == sheet.cellStats.nonEmpty) return false;
  }
};

/*
 * @param spreadsheetId The id of the spreadsheet
 *   where the announce will be checked.
 *
 * Checks for announces in the spreadsheets
 * */
/*
const checkAutomatedAnnounces = async (spreadsheetId) => {
  // Auth process with Google Spreadsheet API
  const document = new GoogleSpreadsheet(spreadsheetId);
  await document.useServiceAccountAuth('CREDENTIALS-HERE');
  await document.loadInfo();

  // Loading in cache the spreadsheets and cells
  // that we will use.
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells("A:G");

  const rowIndex = sheet.cellStats.nonEmpty / spreadsheets.announces.columns;
};
*/
// Register the accessToSpreadsheet funcion
// in the module's exports
