# TD Verification System

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A mobile-first TD (Tooling / Consumables) verification system built using Google Apps Script and Google Sheets. The system allows factory operators to verify required consumables for each assembly line, generate automated PDF reports, archive them in Google Drive, and notify relevant teams via email.

This project was designed specifically for industrial environments where operators use mobile devices on the shop floor. The UI is optimized for quick data entry, large touch targets, and minimal typing.

The system replaces manual checklist verification with a digital workflow that is traceable, auditable, and easy to operate.

---

System Workflow

Operator opens the web app on a mobile device.

Operator selects the assembly line.

The system loads TD consumables configured for that line.

Operator verifies whether each item is used and enters the actual quantity.

Extra consumables not present in the TD list can be added manually.

Operator saves the verification.

The system generates a PDF verification report.

The PDF is stored automatically in Google Drive.

A log entry is written to the TD_INDEX sheet.

An email notification is sent with the report link.

---

Features

Mobile-first interface optimized for factory operators.

Automatic TD list loading based on selected line.

Extra consumable entry support.

PDF report generation for each verification.

Automatic Drive archiving of reports.

Verification index logging.

Email notification after verification.

Connection status indicator (Online / Offline).

Save protection to prevent duplicate submissions.

LockService based concurrency protection.

Automated frequency reminder system based on verification cycle.

---

Project Structure

Code.gs

Backend logic written in Google Apps Script. Handles TD data loading, validation, PDF generation, report storage, logging, reminders, and email notifications.

Index.html

Mobile-optimized frontend UI used by operators to perform TD verification.

Report.html

Template used to generate the PDF verification report.

TD_MASTER Sheet

Stores TD configuration including line, consumables, quantities, and verification frequency.

TD_INDEX Sheet

Stores verification logs with timestamps and links to archived PDF reports.

---

TD_MASTER Sheet Structure

Columns required in TD_MASTER:

LINE  
ITEM_CODE  
ITEM_NAME  
TD_QTY  
UNIT  
FREQ_DAYS  
LAST_VERIFICATION  

Example:

Line1 TD001 Grease Cartridge 2 Nos 7 01-03-2026  
Line1 TD002 Coolant Level 5 L 7 01-03-2026  
Line2 TD003 Lubrication Oil 3 L 15 01-03-2026  

FREQ_DAYS determines how often TD verification should occur.

LAST_VERIFICATION is automatically used to calculate upcoming reminders.

---

TD_INDEX Sheet Structure

Columns required in TD_INDEX:

ID  
Timestamp  
Line  
Link  

Each verification creates a new entry containing the report ID and the Google Drive link for the generated PDF.

---

PDF Report Format

Each verification produces a report with the following structure:

Company Header  
Verification ID  
Assembly Line  
Date and Time  
Consumable verification table  
Total items verified  
Signature placeholders  

Example report filename:

TD_Line1_31-03-2026_001.pdf

Reports are automatically archived inside the Drive folder:

TD_VERIFICATION_RECORDS

---

Reminder System

The system supports automated verification reminders.

Each TD item defines a verification frequency in days.

A scheduled Apps Script trigger runs once per day and checks whether any TD verification is due tomorrow.

If verification is required, an email reminder is sent.

This ensures preventive maintenance checks are not missed.

---

Technology Stack

Google Apps Script  
Google Sheets  
Google Drive  
HTML / CSS / JavaScript

The system runs entirely inside the Google Workspace ecosystem and does not require external infrastructure.

---

Key Engineering Concepts Implemented

Backend and frontend validation.

Data normalization.

Error handling and failure feedback.

Button locking to prevent duplicate submissions.

LockService for concurrency protection.

Crash-safe save flow.

Drive-based report storage.

Automated notification system.

Scalable architecture for multi-line operations.

Mobile-first UI design.

---

Deployment

1. Create a Google Spreadsheet.
2. Create the sheets TD_MASTER and TD_INDEX.
3. Open Apps Script from the spreadsheet.
4. Add the files Code.gs, Index.html, and Report.html.
5. Deploy the project as a Web App.
6. Allow access for the required users.

The system will then be accessible via the web app URL.

---

Future Improvements

QR scanning for consumable bins.

Supervisor approval workflow.

Consumable usage analytics dashboard.

Offline submission support.

Multi-plant architecture.

Consumable consumption trend monitoring.

---

License

MIT License

---

Author

By Yash Aparajit

---
