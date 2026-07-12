# Akmaludien Portfolio — Audit & Build Specification

> Purpose: this file is the single brief you hand to Antigravity to build the site. Part 1 documents what's wrong with the current `portofolio-main.zip`. Part 2 is the corrected, locked-in spec the agent should build from.

---

## PART 1 — AUDIT OF `portofolio-main.zip`

### 1.1 Critical: the project is two unrelated builds glued together, and neither one runs correctly

The zip contains **two separate, incompatible implementations**:

| | What it is | State |
|---|---|---|
| **A. Static site** — `index.html`, `styles.css`, `script.js` | A fully-written vanilla HTML/CSS/JS "terminal / CLI" themed portfolio | Complete, but standalone |
| **B. React scaffold** — `src/main.tsx`, `src/pages/Landing.tsx`, `src/convex/*`, Vite + Shadcn | An auto-generated app scaffold from a "vly.ai / freebuff.com" builder, with Convex database + auth + AI/email/payment integrations wired in | Untouched default template — `Landing.tsx` just renders a "your project is generating..." loading screen |

**The break:** in a Vite React app, `index.html` must contain `<div id="root">` and `<script type="module" src="/src/main.tsx">` so React can mount. The `index.html` in this zip has been fully overwritten by the static site's markup — it has neither. That means:
- If you run `vite build` / `vite dev` today, **the React app (Landing.tsx, routing, Convex) never loads at all.**
- The static site works, but only if served as plain files — it isn't part of the Vite pipeline it's sitting inside.

You cannot "just fix a bug" here — one of these two builds has to be discarded. → Resolved in Part 2 (§2.1).

### 1.2 Unnecessary backend

Scaffold B ships with a full **Convex database + auth system (email OTP, user roles, sign-in page) and a `@vly-ai/integrations` package for AI completions, email sending, and Stripe-style payments.** None of this is needed for a personal portfolio — there's no login, no user data, no payment anywhere in the spec. Carrying it forward would mean maintaining a database and auth flow for a static CV site.

### 1.3 Factual error

- Spec / your identity says your school is **STMKG** (Sekolah Tinggi Meteorologi Klimatologi dan Geofisika).
- The static site's About section instead hardcodes **"Institut Teknologi Bandung (ITB)."**
- This is a wrong-institution error, not a style choice — it must be corrected.

### 1.4 Fabricated content presented as fact

The static site invents specific, verifiable-sounding achievements that aren't in your spec and are risky to publish as-is:

- **Two "published" papers** with real-sounding venues and a 2025 date (*"Intl. Conf. on Meteorology and Climate Science, 2025"*, *"Journal of Instrumentation and Measurement Technology, 2025"*) under a "Publications" section that doesn't exist in your spec. Your spec only lists an **undergraduate thesis** — presenting it as two peer-reviewed publications is a credibility risk if untrue.
- **Specific model performance numbers** on the rainfall project (94.2% accuracy, 0.032 RMSE, 0.96 R²) with no source. If your thesis results aren't finalized, this misrepresents your work.
- **Skill proficiency percentages** (Python 90%, SQL 75%, JavaScript 65%, etc.) — arbitrary numbers not requested in the spec.
- **Certificates** for Coursera/Stanford ML Specialization, Google TensorFlow Developer, IBM Data Science, Cisco IoT, edX/MIT — all invented placeholders styled as real, dated credentials.

None of this is presented as a "[placeholder]" in the HTML — it reads as fact. **Flagging this explicitly so it doesn't ship by accident.**

### 1.5 Contact info is fake but not marked as fake

`akmaludien@example.com`, `linkedin.com/in/akmaludien`, `github.com/akmaludien`, `instagram.com/akmaludien` are guessed placeholders wired as live, clickable links. If launched today, people would email/message dead accounts.

### 1.6 Structural gaps vs. your spec

- **Education** is not its own section (spec lists it as section 3) — it's buried inside About as a sub-block.
- **Scroll progress indicator** — required by the spec, not implemented anywhere in `script.js` (only scroll-to-top exists).
- **Download CV button** (`#download-cv`) points to `href="#"` — no actual file wired.
- **SEO**: only a single meta description, no Open Graph/Twitter card tags, no structured data.
- Skill categories in the spec include **Database (MySQL)** and **Backend (Flask)** as their own groups — the built site only surfaces them inside a generic tech-logo strip, not as tracked skill categories.

### 1.7 Design direction mismatch

Your spec explicitly asks for a **premium/minimal look inspired by Vercel, Linear, Framer, Apple Developer**, using **Inter/Poppins**. What was actually built is a **terminal/hacker CLI aesthetic** — JetBrains Mono/Fira Code throughout, a fake boot sequence, glitch-text name, `$ cat about.md`-style headers. It's well executed as its own style, but it's a different product than what the spec describes.

Good news: your primary color (`#071C36`) and accent (`#22C1FF`) **were correctly carried over** into the CSS — that part matches.

---

## PART 2 — LOCKED DECISIONS

Based on your input:

1. **Design direction: Blend.** Premium/minimal base (Vercel/Linear/Apple-Developer-like spacing, layout, and Inter/Poppins type) as the primary language, with **subtle terminal/code accents** (monospace used only for small tags like tech labels, code snippets, section eyebrows, blinking cursor — not the whole UI).
2. **Tech stack: React + Vite + Tailwind + shadcn/ui, with Convex/auth/payments removed entirely.**

**Why this stack, since you asked for the recommendation:** you already have `framer-motion`, `shadcn/ui`, `Tailwind v4`, and `react-router` correctly installed and configured in the scaffold — that's the expensive part already done. Stripping the unused Convex/auth/AI/payment code down to a plain static Vite+React site gets you component reusability (one `<ProjectCard>`, one `<TimelineItem>`, etc. instead of repeated HTML blocks), easy content editing (data lives in one `content.ts` file, not scattered across markup), and real animation control via Framer Motion — while staying easy for an agentic tool like Antigravity to reason about and modify safely, section by section.

### What to remove from the scaffold
- `src/convex/**`, `convex.json`, `@convex-dev/auth`, `ConvexAuthProvider` in `main.tsx`
- `src/pages/Auth.tsx`, the `/auth` route
- `@vly-ai/integrations`, `integrations.md`, `vly-toolbar-readonly.tsx`, `src/lib/vly-integrations.ts`
- `main.ts` (Deno/Hono server — irrelevant for a static portfolio deploy)
- The root-level `index.html` / `styles.css` / `script.js` static build (fold its good ideas — loader, particles, glassmorphism — into the React version instead of keeping two builds)

### What to keep
- `react`, `react-router`, `framer-motion`, `tailwindcss`, `shadcn/ui` components in `src/components/ui`, `lucide-react`, `src/lib/utils.ts`

---

## PART 3 — CONTENT SPECIFICATION (corrected, ready to build)

### Identity
- **Name:** Akmaludien Ramadhan
- **Headline:** Instrumentation Engineering Student | Machine Learning Enthusiast | Weather & Climate Data Analyst
- **Tagline:** Building Intelligent Weather Prediction Systems with Artificial Intelligence.

### Hero
Full-screen, animated background (subtle particles / gradient mesh evoking weather + data, not a literal terminal boot sequence). Content:
- Name, headline (three roles), short intro:
  > I am an Instrumentation Engineering student at STMKG with a strong interest in Artificial Intelligence, Machine Learning, IoT, and climate data analytics. My work focuses on developing intelligent rainfall prediction systems and transforming environmental data into practical decision-support applications.
- Buttons: **View Projects**, **Download CV** *(needs a real PDF — see Part 4)*, **Contact Me**
- Optional terminal-accent element (kept as *one* small decorative widget, e.g. a code snippet card showing the Bi-LSTM model definition) — not the whole hero.

### About
> I am a final-year Instrumentation Engineering student at Sekolah Tinggi Meteorologi Klimatologi dan Geofisika (**STMKG**). My interests lie at the intersection of instrumentation, meteorology, machine learning, and software development.
>
> I enjoy building intelligent systems that combine environmental sensors, climate datasets, and deep learning models to solve real-world problems.

Current focus tags: Artificial Intelligence · Deep Learning · Time Series Forecasting · Weather Prediction · IoT Monitoring Systems · Data Engineering

### Education *(own section — corrected)*
- **Institution:** Sekolah Tinggi Meteorologi Klimatologi dan Geofisika (STMKG)
- **Program:** Instrumentation Engineering
- **Status:** Final-year undergraduate student

### Skills
| Category | Items |
|---|---|
| Programming | Python, SQL, HTML, CSS, JavaScript |
| Machine Learning | TensorFlow, Keras, Scikit-learn, Pandas, NumPy |
| Data Visualization | Matplotlib, Plotly |
| Database | MySQL |
| Backend | Flask |
| Embedded Systems | Arduino, ESP32 |
| Tools | Git, Linux, Jupyter Notebook |

Recommendation: display as clean tag/pill groups per category rather than fabricated percentage bars. If you want proficiency indicators, use 3–4 honest tiers (e.g. Familiar / Proficient / Advanced) that you actually assign, not invented percentages.

### Projects

**Featured — Rainfall Monitoring and Prediction System using Bidirectional LSTM**
> Developed an intelligent rainfall monitoring and prediction system using Bidirectional Long Short-Term Memory (Bi-LSTM) based on climate data from West Java.

- Features: rainfall prediction, climate monitoring dashboard, historical visualization, performance evaluation, responsive web interface
- Tech: Python, TensorFlow, Flask, MySQL, HTML, CSS, JavaScript
- Performance metrics: **leave blank / "results in progress" until you provide real numbers** — do not reuse the invented 94.2%/0.032/0.96 figures unless they are your actual thesis results.

**IoT Weather Monitoring**
> Real-time weather monitoring platform using environmental sensors connected to a web dashboard.
- Tech: ESP32, MQTT, Flask

**Climate Data Dashboard**
> Interactive dashboard for rainfall, temperature, humidity, and climate analysis.
- Tech: Plotly, Python, Dash

### Research
- **Title:** Rainfall Monitoring and Prediction System using Bidirectional LSTM Based on Climate Data in West Java
- **Type:** Undergraduate Thesis
- **Research areas:** Deep Learning, Time Series Forecasting, Rainfall Prediction, Climate Data Analysis, Meteorology
- Do **not** add a "Publications" section with specific journal/conference names and dates unless you have actual accepted/published papers. If the thesis produces a paper later, add it then with the real venue.

### Experience
Vertical timeline, placeholders for you to fill with real dates/orgs:
1. Academic Research
2. Teaching Assistant / Tutoring
3. Organization
4. Scientific Projects
5. Internship

*(Keep these as empty, clearly-labeled placeholder cards in the build — do not invent company names, dates, or descriptions the way the static site did.)*

### Certificates
Responsive gallery, empty placeholder cards ("Add certificate" state) until you supply real certificate names, issuers, dates, and images.

### Contact
Placeholder fields for: Email, GitHub, LinkedIn, Instagram — wire the UI, but leave values as an editable config (see Part 4) rather than shipping guessed handles.

### Footer
© 2026 Akmaludien Ramadhan — Built with HTML, CSS, JavaScript, and passion for AI & Climate Technology.

---

## PART 4 — INFORMATION YOU NEED TO SUPPLY

Antigravity can scaffold everything above, but these need your real data before launch — treat them as a checklist:

- [ ] Real email address
- [ ] Real GitHub URL
- [ ] Real LinkedIn URL
- [ ] Real Instagram URL (or drop this link if you don't want it public)
- [ ] CV as an actual PDF file, linked from the Download CV button
- [ ] Profile photo
- [ ] Whether the thesis has real performance metrics yet (accuracy/RMSE/R²) — or mark "in progress"
- [ ] Whether you actually have any publications — if not, omit that section entirely
- [ ] Real certificates (name, issuer, date, image) if you have any, otherwise leave the gallery empty/"coming soon"
- [ ] Real dates/organizations for the 5 Experience timeline entries
- [ ] Project repo/live-demo links (currently `href="#"` everywhere)

---

## PART 5 — DESIGN SYSTEM (blended)

**Theme:** Dark mode default, premium, minimal, generous whitespace, glassmorphism used sparingly (cards/nav only — not everywhere).

**Colors**
- Primary: `#071C36`
- Accent: `#22C1FF`
- Background: near-black navy derived from primary (e.g. `#070B14`–`#0A0E17` range), not pure black
- Keep contrast AA-compliant for body text

**Typography**
- Primary UI/body/headings: **Inter** or **Poppins**
- Terminal/code accents only: **JetBrains Mono** or **Fira Code**, used for: section eyebrows (e.g. `// about`), tech tags, a single code-snippet visual, blinking cursor detail — not paragraph text

**Effects**
- Glassmorphism on cards/nav
- Smooth scrolling, soft hover animations (scale/opacity via Framer Motion, no jarring shadows)
- Gradient highlights using the accent color
- Rounded cards (consistent radius scale via Tailwind + shadcn tokens)
- Loading screen: keep, but make it brief and minimal (progress bar / logo fade), not a multi-line fake boot log
- Particle/gradient background in hero: keep, tone down density so it reads "premium data viz" rather than "hacker terminal"

---

## PART 6 — REQUIRED FEATURES CHECKLIST

| Feature | Status in old build | Action |
|---|---|---|
| Fully responsive | Partial (static CSS) | Rebuild responsive in Tailwind |
| SEO friendly | Minimal meta only | Add title, description, OG/Twitter tags, semantic headings |
| Accessible | Weak (icon-only buttons, no alt strategy) | Add aria-labels, alt text, focus states, color-contrast check |
| Sticky navigation | ✅ exists | Port over |
| Scroll progress indicator | ❌ missing | Build new (thin bar under nav) |
| Scroll to top button | ✅ exists | Port over |
| Typing animation | ✅ exists | Port over, react-based (e.g. small custom hook) |
| Animated counters | ✅ exists | Port over via Framer Motion `useInView` |
| Lazy loading | N/A (no real images yet) | Use native `loading="lazy"` once real images/photo/certs are added |
| Loading screen | ✅ exists, over-designed | Simplify per Part 5 |
| Dark mode (default) | ✅ | Keep dark as default; light optional |
| Smooth page transitions | Partial | Use Framer Motion page/section transitions |

---

## PART 7 — BUILD PROMPT FOR ANTIGRAVITY

Paste this directly into Antigravity as the task brief:

```
Build a personal portfolio site for Akmaludien Ramadhan using the uploaded Vite + React 19 +
TypeScript + Tailwind v4 + shadcn/ui + Framer Motion scaffold.

First, strip the scaffold down:
- Remove src/convex/**, convex.json, @convex-dev/auth, ConvexAuthProvider, src/pages/Auth.tsx,
  the /auth route, @vly-ai/integrations and all its references, vly-toolbar-readonly.tsx, and
  main.ts (Deno server). This is a static portfolio — no database, auth, or payments needed.
- Delete the root-level static index.html/styles.css/script.js implementation; instead port its
  best interaction ideas (loader, particle background, typing animation, animated counters,
  scroll-to-top, glassmorphism cards) into the React app as components.
- Fix index.html to be a proper Vite entry point (<div id="root"> + <script type="module"
  src="/src/main.tsx">).

Then build the single-page portfolio using the content and design system in
"Akmaludien_Portfolio_Audit_and_Build_Spec.md" (Parts 3, 5, 6), in this section order:
Hero → About → Education → Skills → Projects → Research → Experience → Certificates →
Contact → Footer.

Design direction: premium/minimal (Vercel/Linear/Apple-Developer-inspired), dark mode default,
Inter or Poppins for all body/heading text, with JetBrains Mono/Fira Code reserved only for
small code-style accents (tags, eyebrows, one code snippet). Primary color #071C36, accent
#22C1FF. Glassmorphism on cards/nav, rounded corners, no heavy shadows, smooth Framer Motion
transitions throughout.

Where real data isn't available yet (email, social links, CV file, profile photo, certificates,
experience dates, project repo/demo links, thesis performance metrics), build the UI with clearly
editable placeholder content in a single central content/data file — do not invent realistic-
looking fake data (no fabricated GitHub/LinkedIn handles, no invented publication venues, no
invented performance numbers or skill percentages).

Implement all items in the Required Features Checklist (Part 6), including the currently-missing
scroll progress indicator and proper SEO meta tags (title, description, Open Graph, Twitter card).

Make everything fully responsive and accessible (alt text, aria-labels, keyboard focus states,
AA color contrast).
```

---

## PART 8 — OPEN QUESTIONS FOR YOU

1. Do you want a **Publications** section at all right now, or only add it once you actually have an accepted paper?
2. Do you have real Experience timeline entries yet, or should the 5 placeholders ship empty/"coming soon" for now?
3. Do you want the light-mode variant, or dark-mode only?
