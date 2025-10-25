# EdgeAI Whitepaper Lead Capture

A responsive React application that allows users to download the **Edge AI executive brief** after submitting their details. The app captures the form data and generates a properly paginated PDF using **html2pdf.js**.

## Live Demo

[View on Vercel](https://whitepaper-lead-capture-b18z.vercel.app/)

---

## Features

- Responsive design (mobile and desktop friendly)  
- Form validation for:
  - Full Name
  - Email
  - Company
  - Job Title  
- Generates downloadable PDF of the whitepaper content  
- Multi-page PDF with proper page breaks and styling  
- "Download White Paper" button disables after the first download  
- Frontend-only application (no backend required)

---

## Setup / Installation

### Prerequisites

- Node.js (v18+ recommended)  
- npm or yarn

### Installation

1. **Clone the repository**  

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

### Install dependencies
npm install

###Run the development server

npm run dev

### Open
http://localhost:5173


### Build for production

npm run build

### Folder Structure
whitepaper-lead-capture/
├─ public/                # Static assets
├─ src/
│  ├─ App.tsx             # Main React app
│  ├─ style.css           # Global styles
│  ├─ App.css             # Component-specific styles
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md

###Frameworks / Tools Used

React 19 – Frontend UI

TypeScript – Type safety

Vite – Development and build tool

html2pdf.js – HTML to PDF conversion

html2canvas – Capture HTML elements as canvas

jsPDF – PDF generation and page handling

###Usage

Fill out the form with your Full Name, Email, Company, and Job Title.

Click Get the White Paper.

Once ready, click Download White Paper.

The generated PDF contains the full whitepaper with proper pagination.