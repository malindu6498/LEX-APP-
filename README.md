# LEX

LEX is a static front-end demo for a legal-services platform. Its pages are kept together at the project root, and shared files are grouped under `assets/`.

## Project layout

```text
LEX-APP-/
├── index.html                 # Landing page and sign-in/sign-up flow
├── dashboard.html             # Client dashboard
├── lawyer-registration.html   # Lawyer professional application
└── assets/
    ├── css/                   # Page stylesheets and font stylesheets
    ├── js/                    # Page behavior
    ├── images/                # Logos and page imagery
    └── fonts/                 # Local font files
```

## Run locally

Serve the repository root over HTTP so page navigation and browser storage work consistently.

From the repository root, run:

```powershell
py -m http.server 8000
```

Open the landing page at:

- <http://localhost:8000/>

The dashboard is at <http://localhost:8000/dashboard.html>. Client sign-up and sign-in navigate there after saving the demo account in browser storage. The dashboard provides quick access to legal documents, lawyer search, and a LEX AI assistant preview. Selecting the lawyer role opens `lawyer-registration.html`.

Stop the local server with `Ctrl+C`.

## Notes

- These are browser-based demos; user and demo state is stored locally in the browser. The AI assistant preview is not connected to a live AI service, and lawyer applications are not sent for review; there is no backend service configured in this repository.
- Keep HTML pages at the project root and place stylesheets, scripts, images, and fonts in their corresponding `assets/` folders.
