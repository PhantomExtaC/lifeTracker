
# 🚀 October Arc
**The Zero-Friction Personal Command Center**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Sheets API](https://img.shields.io/badge/Google_Sheets-Headless_DB-10a37f?style=for-the-badge&logo=googlesheets&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)

October Arc is a mobile-first, zero-friction personal dashboard that uses **Google Sheets as a headless database**. Built to eliminate the friction of manually editing spreadsheets on a mobile device, it provides an ultra-fast, app-like interface for daily tracking, while preserving your ability to build complex data visualizations natively in Google Workspace.

---

## 🏗️ System Architecture

The application bypasses complex backend databases by authenticating directly with Google Cloud via a Service Account, turning a standard spreadsheet into a persistent, real-time JSON API.

```mermaid
sequenceDiagram
    participant User as Mobile PWA
    participant API as Next.js API Routes
    participant Google as Google Sheets API
    
    User->>API: POST / PATCH (Form Data)
    API->>Google: Authenticate & Append Row
    Google-->>API: 200 OK (Updated Range)
    API-->>User: Success (Trigger UI Refresh)
    
    User->>API: GET (Dashboard Load)
    API->>Google: Fetch Tab Data
    Google-->>API: 2D Array
    API-->>User: Formatted JSON

```

---

## ✨ Core Features

* 📱 **PWA-Ready:** Installs directly to your home screen with a persistent bottom navigation bar.
* ⚡ **Zero-Friction Modals:** Full-screen data entry forms prevent mobile keyboard layout breakage.
* ✅ **Interactive Task Management:** Features 1-click completion checkboxes and fuzzy-header matching to prevent schema-breakage.
* 💸 **Live Finance Tracking:** Tracks expenses, incomes, and calculates live remaining balances.
* 🎯 **1-Click Goal Grid:** Tap a category to instantly log daily metrics directly to your sheet.
* 📊 **Native Visualizations:** Includes Google Apps Script to auto-generate pie charts directly inside the spreadsheet.

---

## 🗂️ Project Structure

A clean, feature-based routing architecture using the Next.js App Router.

```text
october-arc/
├── src/
│   ├── app/
│   │   ├── api/sheets/route.ts      # Core GET, POST, PATCH logic
│   │   ├── layout.tsx               # Root HTML & PWA Meta
│   │   └── page.tsx                 # Main Dashboard Grid
│   ├── components/
│   │   ├── forms/                   # Zero-friction input modals
│   │   │   ├── BudgetForm.tsx
│   │   │   ├── NoteForm.tsx
│   │   │   ├── ProgressForm.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── layout/                  # Navigation
│   │   │   └── MobileNav.tsx
│   │   ├── ui/                      # Shared UI wrappers
│   │   │   └── Modal.tsx
│   │   └── widgets/                 # Dashboard Data Visualizations
│   │       ├── BudgetSummary.tsx
│   │       ├── ProgressGrid.tsx
│   │       └── TaskList.tsx
│   ├── lib/
│   │   └── sheets.ts                # Google Auth Singleton
│   └── types/
│       └── index.ts                 # TypeScript Schemas
├── .env.local                       # Ignored in Git
└── tailwind.config.ts

```

---

## 🗄️ Database Schema

Create a single Google Spreadsheet. Add these specific headers to Row 1 of each respective tab (Worksheet).

### 1. `Tasks` Tab

| ID | Date Added | Task Name | Category | Priority | Status | Deadline | Notes | Recurring_Ref_ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |


### 2. `Budget` Tab

| Date | Day | Amount | Type | Transaction | Split With | Settled? | Payment Method |
| --- | --- | --- | --- | --- | --- | --- | --- |


### 3. `Progress` Tab

| Date | Category | Activity | Value | Daily Reflection |
| --- | --- | --- | --- | --- |


### 4. `Notes` Tab

| Date | Title | Content |
| --- | --- | --- |


---

## 🚀 Quick Start

### 1. Google Cloud Setup

1. Enable the **Google Sheets API** in the Google Cloud Console.
2. Create a **Service Account** and download the JSON key.
3. Share your target Google Spreadsheet with the Service Account email (Editor permissions).

### 2. Local Environment

Clone the repository and install dependencies:

```bash
git clone [https://github.com/yourusername/october-arc.git](https://github.com/yourusername/october-arc.git)
cd october-arc
npm install

```

Create a `.env.local` file in the root directory:

```env
SPREADSHEET_ID="your_google_sheet_id_here"
GOOGLE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
# Keep the \n formatting exactly as it appears in your JSON file
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour...Very...Long...Key\n-----END PRIVATE KEY-----\n"

```

Start the development server:

```bash
npm run dev

```

---

## 🌍 Vercel Deployment

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add the three Environment Variables (`SPREADSHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`) in the Vercel deployment settings.
4. Deploy and navigate to the live URL on your mobile device.
5. Tap **Share -> Add to Home Screen** for the native PWA experience.

```
