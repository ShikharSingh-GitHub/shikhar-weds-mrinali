# Shikhar ♥ Mrinali: Wedding Website

A static, dependency-free wedding site (HTML + CSS + vanilla JS). Open `index.html` through any static server, or deploy the folder as-is to Vercel, Netlify or GitHub Pages.

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | All sections, SEO meta, Open Graph and Event JSON-LD |
| `css/styles.css` | Design tokens (blush, lavender, peach, beige, gold), glassmorphism, animations, responsive rules |
| `js/characters.js` | Parametric SVG cartoon couple, with an outfit and backdrop per function (hero, haldi, mehendi, sangeet, wedding, reception) |
| `js/main.js` | Countdown, scratch card, lightbox, tabs, RSVP, guestbook, floating hearts, confetti, `.ics` export |
| `assets/img/` | WebP images optimised from `References/` |
| `References/` | Source material (not needed in production, so leave it out of the deploy) |

## Things to personalise

- **Love story**: the five chapters in `#story` are placeholder copy. Replace them with your real story.
- **Hashtags**: `#ShikharWedsMrinali` / `#CodeMeetsCure` are suggestions.
- **Domain**: once you have one, add `<link rel="canonical">` and make the `og:image` / `twitter:image` URLs absolute.
- **Décor photos**: the moodboard images in `References/Decor` look like web inspiration images. Make sure you're happy to publish them, or swap in your own.

## Collecting RSVPs and wishes (optional, free)

Without a backend, RSVPs offer a "Send on WhatsApp" button and wishes stay in each visitor's browser. To collect everything in a Google Sheet:

1. Create a Google Sheet with two tabs named `RSVP` and `Wishes`.
2. Open **Extensions → Apps Script** and paste:

```js
function doPost(e) {
  const p = e.parameter;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (p.type === 'wish') {
    ss.getSheetByName('Wishes').appendRow([new Date(), p.name, p.message]);
  } else {
    ss.getSheetByName('RSVP').appendRow([new Date(), p.name, p.phone, p.attendance, p.guests, p.meal, p.events, p.message]);
  }
  return ContentService.createTextOutput('ok');
}

function doGet(e) {
  const rows = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Wishes').getDataRange().getValues();
  const wishes = rows.filter(r => r[1] && r[2]).map(r => ({ time: r[0], name: r[1], message: r[2] }));
  return ContentService.createTextOutput(JSON.stringify(wishes)).setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*. Copy the URL.
4. Paste it into `CONFIG.endpoint` at the top of `js/main.js`. Optionally set `CONFIG.whatsapp` (e.g. `919876543210`) so WhatsApp RSVPs go straight to a family number.
