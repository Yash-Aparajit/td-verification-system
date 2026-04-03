# 🏭 TD Verification System

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)
![Platform](https://img.shields.io/badge/platform-Google%20Workspace-orange)
![Status](https://img.shields.io/badge/status-production%20ready-success)
![UI](https://img.shields.io/badge/UI-mobile--first-blue)
![Version](https://img.shields.io/badge/version-1.0-informational)
![License](https://img.shields.io/badge/license-MIT-green)

A **mobile-first TD (Tooling / Consumables) verification system** built using **Google Apps Script + Google Sheets** for factory floor operations.

The system replaces manual consumable verification checklists with a **digital workflow that generates PDF reports, archives them automatically, logs verification history, and sends email notifications.**

It was designed specifically for **industrial environments where operators use mobile devices on the shop floor**.

---

# 📱 Why This System Exists

In many factories TD consumable verification is still performed using **paper checklists**.

This creates several problems:

• No verification history  
• No traceability for audits  
• Manual errors in documentation  
• Difficult retrieval of past reports  
• No reminder system for periodic checks  

This project digitizes the process while keeping the workflow **simple enough for shop floor operators**.

---

# 🚀 Key Features

✔ Mobile-first operator interface  
✔ Automatic TD checklist loading per assembly line  
✔ Extra consumable entry support  
✔ One-click verification submission  
✔ Automated PDF report generation  
✔ Drive-based report archival  
✔ Verification log index  
✔ Email notification with report link  
✔ Verification frequency reminder system  
✔ Concurrency safe backend (LockService)  
✔ Crash-safe save flow  
✔ Mobile feedback (success / failure UI)

---

# 🧭 System Workflow

The entire verification process is designed to be extremely simple for operators.

```
Open Web App
      │
      ▼
Select Assembly Line
      │
      ▼
System loads TD consumables
      │
      ▼
Operator verifies usage
      │
      ▼
Extra consumables can be added
      │
      ▼
Press SAVE
      │
      ▼
PDF report generated
      │
      ▼
Stored in Google Drive
      │
      ▼
Log entry written to TD_INDEX
      │
      ▼
Email notification sent
```

---

# 📊 System Architecture

```
Operator Mobile UI
        │
        ▼
 Google Apps Script Web App
        │
        ▼
 ┌───────────────┬───────────────┬───────────────┐
 │ Google Sheets │ Google Drive  │ Email System  │
 │ TD_MASTER     │ PDF Reports   │ Notifications │
 │ TD_INDEX      │ Archive       │ Alerts        │
 └───────────────┴───────────────┴───────────────┘
```

The entire system runs inside **Google Workspace infrastructure**, requiring **no external servers or databases**.

---

# 📂 Project Structure

```
td-verification-system
│
├── Code.gs
├── Index.html
├── Report.html
├── README.md
│
└── Google Sheets
    ├── TD_MASTER
    └── TD_INDEX
```

### Code.gs
Backend logic including:

• TD data loading  
• validation  
• PDF generation  
• Drive storage  
• logging  
• email notifications  
• reminder engine  

### Index.html
Mobile-optimized operator interface.

### Report.html
Template used to generate PDF verification reports.

---

# 📋 TD_MASTER Sheet Structure

The **TD_MASTER** sheet defines consumables and verification frequency.

| Column | Description |
|------|-------------|
| LINE | Assembly line name |
| ITEM_CODE | Unique consumable identifier |
| ITEM_NAME | Consumable description |
| TD_QTY | Expected quantity |
| UNIT | Measurement unit |
| FREQ_DAYS | Verification frequency in days |
| LAST_VERIFICATION | Last completed verification date |

### Example

| LINE | ITEM_CODE | ITEM_NAME | TD_QTY | UNIT | FREQ_DAYS | LAST_VERIFICATION |
|----|----|----|----|----|----|----|
| Line1 | TD001 | Grease Cartridge | 2 | Nos | 7 | 01-03-2026 |
| Line1 | TD002 | Coolant Level | 5 | L | 7 | 01-03-2026 |
| Line2 | TD003 | Lubrication Oil | 3 | L | 15 | 01-03-2026 |

---

# 📑 TD_INDEX Sheet Structure

Every verification creates a new entry.

| Column | Description |
|------|-------------|
| ID | Unique verification ID |
| Timestamp | Verification time |
| Line | Assembly line |
| Link | Google Drive report link |

Example:

| ID | Timestamp | Line | Link |
|----|----|----|----|
| TD_Line1_20260331_101200 | 31-03-2026 | Line1 | Drive Report |

---

# 📄 PDF Verification Report

Each verification generates a professional report including:

• Company header  
• Verification ID  
• Assembly line  
• Date and time  
• Consumable checklist table  
• Total verified items  
• Signature placeholders  

Example report filename:

```
TD_Line1_31-03-2026_001.pdf
```

Reports are automatically archived inside:

```
TD_VERIFICATION_RECORDS
```

in Google Drive.

---

# 🔔 Automated Reminder System

Each consumable defines a verification frequency.

```
Next Verification Date
= LAST_VERIFICATION + FREQ_DAYS
```

A scheduled Apps Script trigger runs **once per day** and checks whether any TD verification is required tomorrow.

If verification is due:

```
Reminder – TD Verification Required Tomorrow
```

email is sent automatically.

This ensures **preventive checks are never missed**.

---

# ⚙️ Technology Stack

| Component | Technology |
|----------|-------------|
| Backend | Google Apps Script |
| Database | Google Sheets |
| Storage | Google Drive |
| Frontend | HTML / CSS / JavaScript |
| Notifications | Gmail API |

---

# 🧠 Engineering Concepts Used

This project intentionally demonstrates several engineering practices:

• backend + frontend validation  
• data normalization  
• error handling  
• button locking  
• concurrency control using LockService  
• crash-safe transaction flow  
• automated report generation  
• server-side PDF creation  
• scheduled background jobs  
• scalable sheet architecture  

---

# 📦 Deployment

1. Create a Google Spreadsheet  
2. Create sheets **TD_MASTER** and **TD_INDEX**  
3. Open **Apps Script editor**  
4. Add `Code.gs`, `Index.html`, `Report.html`  
5. Deploy as **Web App**  
6. Grant user access  

The system is then accessible through the web app URL.

---

# 🔮 Future Improvements

Possible enhancements for future versions:

• QR scanning for consumable bins  
• supervisor approval workflow  
• TD verification dashboard  
• consumable usage analytics  
• offline submission capability  
• multi-plant architecture  

---

# 📜 License

MIT License

---

# 👨‍💻 Author

By Yash Aparajit

---
