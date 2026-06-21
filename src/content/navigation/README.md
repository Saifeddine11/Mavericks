# Content — navigation

Menu labels and chrome strings:

| Concern | Location |
|---------|----------|
| Menu items | `src/i18n/locales/fr.json` → `cinematic.menu.*` |
| Header CTA | `chrome.enquire` |
| Anchor map | `src/config/navigation.js` |
| Component | `src/components/cinematic/CinematicChrome.jsx` → `MENU_ITEMS` |

When adding a menu item: update i18n (all locales), `MENU_ITEMS`, and `navigation.js`.
