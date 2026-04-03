const SPREADSHEET_ID = SpreadsheetApp.getActive().getId();
const MASTER_SHEET = "TD_MASTER";
const INDEX_SHEET = "TD_INDEX";
const DRIVE_FOLDER_NAME = "TD_VERIFICATION_RECORDS";
const EMAIL_NOTIFY = "YOUR EMAIL ID HERE";


/* ---------- WEB APP ---------- */


function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("TD Verification");
}


/* ---------- LOAD MASTER DATA ---------- */


function getTDData() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(MASTER_SHEET);

  const data = sheet.getDataRange().getValues();
  data.shift();

  let result = {};

  data.forEach(r => {

    const line = normalize(r[0]);

    if (!result[line]) result[line] = [];

    result[line].push({
      itemCode: normalize(r[1]),
      itemName: normalize(r[2]),
      tdQty: Number(r[3]),
      unit: normalize(r[4])
    });

  });

  return result;
}
