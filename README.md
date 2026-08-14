# AI Mock Exam Portal

A web application for conducting and managing mock online examinations. It provides an accessible student workflow for signing in, selecting exams, taking an exam, and reviewing status and performance.

## Features

- Firebase authentication with sign-up and login flows
- Student dashboard with profile and exam navigation
- Mock-exam experience and exam-status tracking
- University and country data integrations
- Responsive React user interface

## Tech stack

- React and TypeScript
- Vite
- Tailwind CSS
- Firebase

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Project structure

```text
src/
  Pages/        Application routes and screens
  components/   Shared interface components
  services/     External data services
  firebase.ts   Firebase configuration
```
