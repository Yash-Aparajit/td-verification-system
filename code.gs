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


/* ---------- SAVE CHECKLIST ---------- */


function saveChecklist(payload) {

  const lock = LockService.getScriptLock();

  try {

    lock.waitLock(30000);

    validatePayload(payload);

    const id = generateID(payload.line);

    const pdf = generatePDF(payload, id);

    const link = pdf.getUrl();

    logIndex(id, payload.line, link);

    sendEmail(id, payload.line, link);

    return {
      success: true,
      id: id,
      link: link
    };

  } catch (err) {

    throw new Error("SERVER_ERROR: " + err.message);

  } finally {

    lock.releaseLock();

  }

}


/* ---------- VALIDATION ---------- */


function validatePayload(p) {

  if (!p.line) throw new Error("Line missing");

  if (!p.rows || p.rows.length === 0)
    throw new Error("No rows submitted");

  p.rows.forEach(r => {

    if (!r.itemCode) throw new Error("Item code missing");

    if (!r.itemName) throw new Error("Item name missing");

    if (r.used !== "YES" && r.used !== "NO")
      throw new Error("Invalid used flag");

    if (isNaN(r.actualQty))
      throw new Error("Invalid quantity");

  });

}
