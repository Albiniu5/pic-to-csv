---
description: Complete process of building the app
---

📘 PROJECT BUILD PLAN

Interactive AI Document → CSV / Excel Migration Web App


---

1. PROJECT GOAL

Build a web-based, AI-assisted data extraction and mapping application that allows users to:

Upload a PDF or image containing a table

Automatically extract tabular data using OCR + layout detection

Interactively correct and map rows and columns via a visual UI

Export clean, structured CSV or XLSX files suitable for ERP or system imports


The system must prioritize human-in-the-loop control, accuracy, and transparency over full automation.


---

2. CORE PRINCIPLES

AI assists, user decides

Visual-first UX

Zero-code, office-worker friendly

No hard dependency on a specific ERP

Enterprise-style reliability



---

3. TECH STACK (MANDATORY)

Frontend

Language: TypeScript

Framework: Next.js (React, App Router)

Styling: Tailwind CSS

UI components: shadcn/ui

Table engine: TanStack Table

Drag & Drop: dnd-kit

PDF rendering: PDF.js

Canvas overlays: Konva.js or Fabric.js


Backend

Language: Python 3.11+

Framework: FastAPI

Data processing: pandas

Validation: pydantic

Async task handling: Celery or FastAPI background tasks


AI & OCR

OCR provider: Google Document AI OR Azure Form Recognizer

LLM: GPT-4 / GPT-4.1 / GPT-4o / Mistral / everything u have an api for

OCR output format: structured JSON (cells, rows, bounding boxes)


Storage

Temporary files: local or S3-compatible storage

Session state: Redis or in-memory (MVP acceptable)

No permanent document storage required for MVP



---

4. USER FLOW (STRICT)

Step 1 — Upload

Accept:

PDF

PNG / JPG


Show upload progress

Immediately render document preview



---

Step 2 — AI Extraction

Send document to OCR engine

Extract:

Tables

Rows

Columns

Cell bounding boxes


Return structured JSON



---

Step 3 — Interactive Mapping UI (CRITICAL)

The frontend must display:

Document preview on the left

Extracted table on the right

Bounding box overlay when hovering table cells


User interactions:

Rename columns

Reorder columns (drag & drop)

Ignore columns

Ignore rows (headers, totals)

Merge columns

Split columns (by delimiter or AI suggestion)

Reassign column data types



---

Step 4 — AI Suggestions (NON-AUTOMATIC)

AI suggests:

Header rows

Total rows

Data types

Column meaning


User must explicitly accept or reject suggestions



---

Step 5 — Validation

Highlight:

Empty required columns

Type mismatches

Suspicious values


Provide simple fixes:

Trim

Convert

Remove rows




---

Step 6 — Export

Formats:

CSV

XLSX


Allow preview before export

Download generated file



---

5. FRONTEND COMPONENT STRUCTURE

/app
 ├── upload/
 ├── extract/
 ├── map/
 ├── validate/
 ├── export/
 └── api/

Key Components

DocumentViewer

TableEditor

ColumnMapper

RowFilter

ValidationPanel

ExportPanel



---

6. BACKEND API ENDPOINTS

File Upload

POST /api/upload

OCR Extraction

POST /api/extract

Returns:

{
  "tables": [
    {
      "cells": [
        {
          "row": 1,
          "col": 1,
          "text": "Customer ID",
          "bbox": [x1, y1, x2, y2]
        }
      ]
    }
  ]
}


---

AI Suggestions

POST /api/ai/suggest

Input:

OCR table JSON

User edits so far


Output:

Suggested headers

Row classifications

Column types



---

Validation

POST /api/validate


---

Export

POST /api/export

Returns downloadable CSV/XLSX


---

7. DATA MODEL (SIMPLIFIED)

Table
  ├── columns[]
  │    ├── id
  │    ├── name
  │    ├── type
  │    ├── ignored
  │
  ├── rows[]
  │    ├── values[]
  │    ├── ignored


---

8. LLM USAGE RULES (IMPORTANT)

LLM must never overwrite user decisions

LLM only provides:

Suggestions

Confidence scores


Prompts must be deterministic and structured

No hallucinated columns



---

9. NON-GOALS (DO NOT BUILD)

Albinius' Gold, [14/01/2026 11:07]
No ERP-specific connectors (v1)

No authentication (MVP)

No batch uploads

No automatic exports without review



---

10. MVP SUCCESS CRITERIA

User can upload a messy PDF

User can fix table structure visually

User exports a clean CSV usable in Excel or ERP

No manual Excel cleanup needed afterward



---

11. DEVELOPMENT PHASES

Phase 1 — Extraction

Upload + OCR + preview


Phase 2 — Mapping UI

Editable table + drag & drop


Phase 3 — AI Suggestions

Header & row detection


Phase 4 — Export

CSV + XLSX



---

12. QUALITY REQUIREMENTS

Deterministic output


---

13. FINAL INSTRUCTION TO BUILD AI

> Build this as a production-ready but MVP-scoped B2B web application.
Prioritize correctness, clarity, and human control over automation.
Treat this as a data migration cockpit, not a generic OCR tool. each prompt = separate llm call, cache results per session	




---

14. EXTRA UTILITY FEATURES

Table Selection & Export
- **Problem**: When multiple tables are extracted, user might only want a subset.
- **Solution**: 
    - Added checkboxes to each table card.
    - Global "Download" button dynamically changes behavior:
        - No Selection: Downloads ALL tables (merged).
        - Selection Active: Downloads ONLY selected tables (merged).


---

15. ENHANCED UTILITY REQUIREMENTS (Requested 14/01/2026)

1. **PDF Table Extraction**:
   - Detect/extract all tables separately.
   - Maintain table hierarchy.

2. **Interactive Table Editor**:
   - Drag & Drop reordering (rows/cols).
   - Add/Delete rows & columns.
   - **AI Column Autocomplete**: Analyze table, suggest header, and populate values.

3. **User Interface & UX**:
   - Real-time updates.
   - Visual distinction for edited/AI cells.

4. **AI Assistance**:
   - Context understanding for corrections.

5. **Technical Requirements**:
   - Modern Web Stack (React).
   - *Note: Backend requirements adapted to Client-side AI for MVP speed.*

