# Oliver Labawan — Portfolio

Plain HTML/CSS/JS. No build step, no framework — open `index.html` in a browser and it works.

## Files
- `index.html` — all content. Sections are labeled with comments (`<!-- EDIT ME -->`) where you'll want to swap in real screenshots later.
- `styles.css` — all styling. Colors, fonts, and spacing are defined once at the top under `:root` — change a value there and it updates everywhere.
- `script.js` — just sets the footer year.

## Edit it
Open `index.html` in any text editor (VS Code is fine). Each `<section>` is one part of the page — hero, services, work, process, testimonials, tools, contact. Change the text directly.

To swap a placeholder case-study visual for a real screenshot, replace:
```html
<div class="case-visual" data-label="Workflow diagram"></div>
```
with:
```html
<img class="case-visual" src="images/your-screenshot.png" alt="Description">
```
(create an `images/` folder for your screenshots first).

## Put it on GitHub
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
gh repo create portfolio --public --source=. --push
```
(No `gh` CLI? Create a repo on github.com, then `git remote add origin <url>` and `git push -u origin main`.)

## Host it free — Vercel
1. Go to vercel.com → New Project → Import your GitHub repo.
2. Framework preset: **Other** (it's static, no build needed).
3. Deploy. You'll get a `.vercel.app` URL immediately.
4. Add a custom domain under Project → Settings → Domains once you own one.

## Host it free — Netlify
1. Go to app.netlify.com → Add new site → Import an existing project → pick the GitHub repo.
2. Build command: leave blank. Publish directory: `.` (the root).
3. Deploy. Add a custom domain under Site settings → Domain management.

Either way: every time you `git push`, the live site updates automatically.

## Buying a domain
Namecheap or Porkbun are cheap and simple. Point the domain's nameservers (or a CNAME/A record) at Vercel/Netlify following whichever platform's own domain instructions — they'll show you the exact records once you add the domain in their dashboard.
