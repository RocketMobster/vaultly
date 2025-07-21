# Product Requirements Document (PRD)

**Product Name:** Vaultly\
**Tagline:** *Your collection, your rules.*\
**Owner:** Craig / RocketMobster Software\
**Date:** July 2025\
**Status:** Approved for MVP build

---

## 1. Overview

Vaultly is a customizable, mobile-first app for managing and showcasing personal collections—comics, cards, books, vinyl, toys, and more. With a dynamic field system, flexible views, offline-first functionality, and plugin support, users can fully tailor the app to suit their unique collecting needs.

---

## 2. Goals

- Provide intuitive tools for organizing diverse collection types.
- Enable modular extensions through plugins.
- Support full offline functionality with optional cloud sync.
- Let users customize fields, views, and import/export formats.

---

## 3. Key Features

### ✅ Core

- Unlimited collections
- Add/edit/delete items
- Upload images, assign tags, set values and metadata
- Advanced filtering, sorting, and search
- Offline-first with optional cloud backup

### 🔧 Customization

- Create custom fields for each collection
- List, grid, and gallery view modes
- Quick add and batch import/export
- Tagging, rating, and condition tracking
- Themes and layout preferences

### 🔌 Plugin Support

- Add new field types (e.g. star ratings, barcode scanner)
- Integrate external APIs (e.g. Goodreads, eBay, ComicVine)
- Add importers/exporters (e.g. CSV, JSON, PDF)
- Load plugins manually or via a plugin manager UI

---

## 4. UI/UX Wireframes

### 🏠 Dashboard

- Displays all collections as cards or a list
- Options to add/edit/delete a collection
- Sync status and plugin indicators

### 📂 Collection Detail Page

- Items displayed in list/grid/gallery
- Filtering by tags, condition, year, etc.
- Batch actions (delete, tag, export)

### 📝 Item Detail Page

- Full-screen layout with image, notes, and metadata
- Editable custom fields based on schema
- View history, duplicates, and variants

### 🧩 Plugin Manager

- List of active/inactive plugins
- Add plugins via file upload or GitHub
- Per-plugin settings UI

---

## 5. Technical Requirements

### 💻 Frontend

- **React (or React Native)**
- TailwindCSS
- State: Zustand or Redux Toolkit
- Offline Storage: IndexedDB (via Dexie.js), localStorage

### ☁️ Backend (Optional)

- Supabase or Firebase for cloud sync
- Node.js/Express or serverless for plugin sandboxing
- REST API and/or GraphQL

---

## 6. Initial File/Directory Structure

```
/vaultly
├── /public
│   └── index.html
├── /src
│   ├── /assets          # Images, icons, etc.
│   ├── /components      # Shared UI components
│   ├── /collections     # Collection types and schemas
│   ├── /pages           # Route-based pages
│   ├── /plugins         # Plugin loader and installed plugins
│   ├── /store           # Zustand or Redux state files
│   ├── /styles          # Tailwind or custom CSS
│   ├── /utils           # Utility/helper functions
│   ├── /views           # List, Grid, Gallery view modes
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
├── manifest.json       # For PWA support
└── package.json
```

---

## 7. Plugin Architecture

### 🔌 Plugin Manifest Example

```json
{
  "name": "Barcode Scanner",
  "type": "field",
  "entry": "barcodeField.js",
  "fields": ["UPC", "EAN"],
  "dependencies": []
}
```

### 📦 Plugin Types

- `field`: Adds a new input type (e.g., toggle, barcode scan)
- `datasource`: Connects to external APIs or services
- `exporter`: Adds export formats (CSV, PDF, XML)
- `importer`: Adds import capability (e.g., from Goodreads or Discogs)

Plugins reside in `/plugins` folder and are auto-loaded if manifest is valid.

---

## 8. Sample Data Schema (JSON)

```json
{
  "collections": [
    {
      "id": "comics",
      "name": "Comic Books",
      "fields": [
        "Title",
        "Issue",
        "Publisher",
        "Year",
        "Condition",
        "Tags"
      ]
    }
  ],
  "items": [
    {
      "collectionId": "comics",
      "data": {
        "Title": "Batman",
        "Issue": "#404",
        "Publisher": "DC",
        "Year": 1987,
        "Condition": "Near Mint",
        "Tags": ["Frank Miller"]
      }
    }
  ]
}
```

---

## 9. API Outline (for Sync/Cloud)

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | `/collections`     | Create new collection      |
| GET    | `/collections/:id` | Retrieve collection        |
| PATCH  | `/collections/:id` | Update collection          |
| DELETE | `/collections/:id` | Delete collection          |
| POST   | `/items`           | Add new item               |
| GET    | `/items/:id`       | Get item metadata          |
| PUT    | `/sync`            | Sync local data with cloud |

---

## 10. User Roles

### 👤 Standard User

- Full access to collections and item management
- View public plugins and install basic ones

### 🛠️ Power User

- Access plugin creation tools
- Use developer/debug mode
- Import/export plugin packages

---

## 11. Milestones

### ✅ MVP

- Collection & item CRUD
- Offline-first storage
- List/grid view toggle
- Custom fields & tags

### 🔜 Phase 2

- Plugin system
- Cloud sync & account system
- Import/export utilities

### 🧩 Phase 3

- Plugin marketplace
- Public/shared vaults
- AI auto-tagging
- Collectible valuation via 3rd party API

---

## 12. Success Metrics

- Number of active collections per user
- Plugin adoption rates
- Average items per collection
- Cloud sync usage
- Export/import frequency

---

## 13. Risks & Considerations

- Plugin sandboxing to ensure data isolation and security
- Handling sync conflicts (merge, overwrite, duplicate detection)
- Plugin compatibility with future updates
- Accessibility and internationalization support

