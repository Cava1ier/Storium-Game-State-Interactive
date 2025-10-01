# Storium Game State Manager: Next Steps

This document outlines the future development priorities for the application. With the core architecture stabilized and full inline CRUD functionality implemented, the focus now shifts to enhancing the user experience, adding deeper gameplay mechanics, and ensuring data persistence.

---

### 1. (High Priority) Implement Data Persistence

*   **Problem:** The application currently uses an in-memory database, meaning any changes are lost upon refreshing the page. This prevents any real, long-term use.

*   **Action Plan:**
    1.  **Integrate Browser Storage:** Modify the `DatabaseDriver` or `GameScaffold` service to use `localStorage` or `IndexedDB`.
    2.  **Auto-Save:** Automatically save the entire database state to browser storage whenever a CRUD operation occurs.
    3.  **Load on Startup:** On application load, check for saved data in storage. If it exists, load it; otherwise, fall back to the `initialData`.
    4.  **Import/Export Feature:** Add "Import" and "Export" buttons to the `RawDataPanel` that allow users to download their current game state as a text file or upload one to replace the current state.

*   **Why it's #1:** This is a critical feature that enables users to save their game progress, making the application a viable tool for managing actual multi-session campaigns.

---

### 2. (Medium Priority) Add a High-Level Dashboard View

*   **Problem:** The UI is data-dense and table-heavy, which is great for editing but lacks a simple, at-a-glance overview of the game's state.

*   **Action Plan:**
    1.  **Create Dashboard Component:** Design and build a new read-only component that visualizes key game state information.
    2.  **Key Metrics:** This dashboard could include:
        *   A summary of characters and their current status, grouped by player.
        *   An overview of pips used vs. total available for the current scene or act.
        *   A log of the most recent gameplay actions (e.g., cards played).
    3.  **UI Integration:** Add a new tab or a collapsible panel to display this dashboard without cluttering the main editing interface.

*   **Why it's #2:** A dashboard provides a valuable summary for Game Masters, helping them quickly assess the state of play and make informed decisions during a game session.

---

### (Completed) Enhance Character Creation

*   **Problem:** New characters were created with a generic, non-customizable "starter pack" of cards via a simple inline form.
*   **Solution:** The character creation process has been moved into a comprehensive modal. This new workflow allows players to:
    *   Define a custom name and description for their unique "Nature" card.
    *   Select their starting "Strength" and "Subplot" cards from lists of available options.
    *   This provides deeper character customization and player agency from the very beginning of the game.

### (Completed) Implement Character-to-Player Assignment in UI

*   **Problem:** Character ownership by players was defined in the data model but could not be managed through the UI.
*   **Solution:** An "Player" dropdown has been added to the inline editing form for creating and updating characters, allowing for easy assignment and un-assignment of players.

### (Completed) Automate Character "Starter Pack"

*   **Problem:** Creating a new character required manually adding their basic set of cards (Nature, Strength, Wilds, etc.), which was repetitive and time-consuming.
*   **Solution:** New characters are now automatically provisioned with a default starter pack of cards upon creation, streamlining the setup process.