# Vaultly Roadmap

## 1. Core Feature Enhancements
- Item Editing: Add ability to edit existing items (not just add/delete).
- Field Types Expansion: Support more field types (dropdown, tags, images, ratings, etc.).
- Validation: Add field validation (required, min/max, etc.).
- Batch Import/Export: CSV/JSON import/export for collections and items.

## 2. Advanced Collection & Item Management
- Filtering & Sorting: Advanced filtering and sorting on collection items (by tags, year, etc.).
- Search: Full-text search across collections and items.
- Tagging & Condition Tracking: UI for tagging and tracking item condition.
- Batch Actions: Select multiple items for batch delete, tag, or export.

## 3. UI/UX Improvements
- Responsive Design: Polish mobile and tablet layouts.
- Themes: Light/dark mode and custom themes.
- Gallery Enhancements: Image upload and gallery view for items.

## 4. Plugin System (Phase 2)
- Plugin Loader: UI for loading and managing plugins from `/plugins` folder.
- Plugin API: Define and document plugin API for new field types, importers/exporters, etc.
- Plugin Manager UI: Enable/disable plugins, per-plugin settings.

## 5. Offline & Sync
- Cloud Sync: Integrate Supabase or Firebase for optional cloud backup and sync.
- Conflict Resolution: Handle sync conflicts (merge, overwrite, duplicate detection).
- User Accounts: Basic authentication for cloud sync.

## 6. Import/Export Utilities
- Importers: Goodreads, Discogs, eBay, etc.
- Exporters: PDF, XML, custom formats.

## 7. Marketplace & Sharing (Phase 3)
- Plugin Marketplace: Discover and install plugins from a public registry.
- Public/Shared Vaults: Share collections with others or make them public.
- AI Features: Auto-tagging, valuation via 3rd party APIs.

## 8. Quality & Accessibility
- Accessibility: Ensure WCAG compliance.
- Internationalization: Multi-language support.
- Testing: Add unit and integration tests.

---

**Suggested Next Steps:**
- Prioritize item editing, filtering/sorting, and search for immediate usability.
- Begin plugin loader and API design in parallel with UI polish.
- Plan for cloud sync and user accounts as a separate milestone.
