const SPREADSHEET_ID = SpreadsheetApp.getActive().getId();
const MASTER_SHEET = "TD_MASTER";
const INDEX_SHEET = "TD_INDEX";
const DRIVE_FOLDER_NAME = "TD_VERIFICATION_RECORDS";
const EMAIL_NOTIFY = "yash.aparajit@schnellecke-jeena.co.in";


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


/* ---------- NORMALIZATION ---------- */


function normalize(v) {

  if (!v) return "";

  return String(v).trim();

}


/* ---------- UNIQUE ID ---------- */


function generateID(line) {

  const date = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyyMMdd_HHmmss"
  );

  return `TD_${line}_${date}`;

}


/* ---------- Filename Generator ---- */


function generateFileName(line){

  const folder = getFolder();

  const today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd-MM-yyyy"
  );

  const prefix = `TD_${line}_${today}_`;

  let count = 0;

  const files = folder.getFiles();

  while(files.hasNext()){
    const f = files.next().getName();
    if(f.startsWith(prefix)) count++;
  }

  const seq = String(count + 1).padStart(3,"0");

  return `${prefix}${seq}.pdf`;
}


/* ---------- GENERATE PDF ---------- */


function generatePDF(data, id) {

  const template = HtmlService.createTemplateFromFile("Report");

  template.data = data;
  template.id = id;
  template.time = new Date();

  const html = template.evaluate().getContent();

  const blob = Utilities.newBlob(html, "text/html")
    .getAs("application/pdf")
    .setName(generateFileName(data.line));

  const folder = getFolder();

  return folder.createFile(blob);

}


/* ---------- DRIVE FOLDER ---------- */


function getFolder() {

  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);

  if (folders.hasNext()) return folders.next();

  return DriveApp.createFolder(DRIVE_FOLDER_NAME);

}


/* ---------- INDEX LOG ---------- */


function logIndex(id, line, link) {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = ss.getSheetByName(INDEX_SHEET);

  if (!sheet) {

    sheet = ss.insertSheet(INDEX_SHEET);

    sheet.appendRow(["ID", "Timestamp", "Line", "Link"]);

  }

  sheet.appendRow([
    id,
    new Date(),
    line,
    link
  ]);

}


/* ---------- EMAIL NOTIFICATION ---------- */


function sendEmail(id, line, link) {

  const subject = `TD Verification Completed – ${line}`;

  const date = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd-MM-yyyy HH:mm"
  );

  const body = `
  TD CONSUMABLE VERIFICATION

  Line : ${line}
  Verification ID : ${id}
  Date & Time : ${date}

  The verification report has been archived.

  Report Link
  ${link}

  -- Automated TD Verification System --
  `;

  MailApp.sendEmail({
    to: EMAIL_NOTIFY,
    subject: subject,
    body: body
  });

}


/* ---------- Reminder Frequency  ---------- */


function frequencyReminder() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(MASTER_SHEET);

  const data = sheet.getDataRange().getValues();
  data.shift();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let reminderLines = [];

  data.forEach(r => {

    const line = r[0];
    const freqDays = Number(r[5]);
    const lastDate = new Date(r[6]);

    if (!freqDays || !lastDate) return;

    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + freqDays);

    if (
      nextDate.getDate() === tomorrow.getDate() &&
      nextDate.getMonth() === tomorrow.getMonth() &&
      nextDate.getFullYear() === tomorrow.getFullYear()
    ) {
      reminderLines.push(line);
    }

  });

  if (reminderLines.length === 0) return;

  const subject = "Reminder – TD Verification Required Tomorrow";

  const body = `
  TD Verification Reminder

  The following lines require TD verification tomorrow:

  ${reminderLines.join("\n")}

  Please ensure verification is completed.

  -- TD Verification System --
  `;

  MailApp.sendEmail({
    to: EMAIL_NOTIFY,
    subject: subject,
    body: body
  });

}
