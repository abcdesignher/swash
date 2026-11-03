# Task 3: Interview Preparation Answers

All fourteen questions answered concisely ($\le 200$ words each), followed by the user-enumeration explanation.

---

### 1. Why is client-side validation insufficient?
Client-side validation executes entirely inside the user's browser—an environment the user or an attacker completely controls. Anyone can bypass HTML attributes (`required`, `maxlength`), disable JavaScript, edit DOM state in Chrome DevTools, or send raw HTTP requests directly to `/api/auth` using `curl`, Postman, or an automated script (`evidence/16-direct-request-command-and-response.txt`). Therefore, client-side validation improves user experience and accessibility for honest users, but provides zero security guarantee for the backend or database.

---

### 2. What security checks belong in the frontend, and what must the server enforce?
The frontend should handle **usability-oriented safety checks**: masking password inputs (`type="password"` with an explicit toggle), omitting password-composition hints on login screens, preventing accidental duplicate clicks (`disabled` while submitting), and validating input format early to save round-trips on slow networks. The **server** must enforce all actual security boundaries: schema validation, type and length enforcement, email normalisation, adaptive password hashing, rate limiting, authentication, session verification, and record-ownership authorisation.

---

### 3. Is hiding an administrative button enough to protect the action?
No. Hiding a "Delete Customer" or "Approve Refund" button in the React UI (`{isAdmin && <button>}`) is purely cosmetic security-by-obscurity. The underlying API route (`POST /api/admin/...`) or Server Action URL remains discoverable in client JavaScript bundles and network logs. An unprivileged user or attacker can invoke the endpoint directly via `curl` or `fetch()`. Every privileged endpoint must verify the caller's authenticated session and administrative role on the server before executing the action.

---

### 4. What is the difference between validation, encoding, and sanitisation?
- **Validation** checks whether input conforms to expected rules (type, length, regex pattern) and **rejects** the input if it fails (e.g., rejecting an invalid email or 1-character name).
- **Encoding** transforms data into a safe representation for a specific output context so characters are treated as data rather than executable code (e.g., HTML-entity encoding `<script>` as `&lt;script&gt;` or parameterised SQL queries).
- **Sanitisation** modifies or strips unsafe parts from input so the remainder can be accepted (e.g., stripping `<script>` tags from rich-text HTML).

---

### 5. Why validate route parameters and query strings as well as request bodies?
Attackers manipulate URL path parameters (`/orders/:id`) and query strings (`?mode=...&limit=999999`) just as easily as JSON request bodies—often more easily, via a browser address bar or crafted link. Unvalidated route parameters can cause unhandled database errors (e.g., invalid UUID/CUID formats), injection vulnerabilities, or Insecure Direct Object Reference (IDOR) leaks, while unvalidated query parameters can trigger denial-of-service via unbounded pagination or unexpected application state transitions.

---

### 6. What is a single-page application?
A Single-Page Application (SPA) is a web application architecture where the browser loads an initial HTML shell and JavaScript bundle, and subsequent navigation or view changes (such as switching between `/auth?mode=register` and `/auth?mode=login`) dynamically update the DOM in memory using JavaScript and the History API without requesting a full new HTML document reload from the server.

---

### 7. What are the advantages and disadvantages of a single-page application?
- **Advantages:** Instantaneous view transitions without full-page flicker, preserved in-memory UI state across mode switches (such as keeping a typed email when switching from Register to Sign In), and reduced bandwidth for repeated layout chrome on slow Nigerian mobile connections.
- **Disadvantages:** Larger initial JavaScript bundle download and parse cost, potential SEO and Open Graph metadata limitations if rendered purely client-side without SSR, and extra engineering responsibility to manage focus, browser history, and screen-reader route announcements manually.

---

### 8. What are the four principles of WCAG?
The four principles of WCAG (POUR) are:
1. **Perceivable:** Information and UI components must be presentable in ways users can perceive (e.g., text alternatives, sufficient contrast, not relying on colour alone).
2. **Operable:** UI components and navigation must be operable by all users (e.g., full keyboard accessibility, visible focus rings, no keyboard traps).
3. **Understandable:** Information and UI operation must be clear and predictable (e.g., explicit field labels, clear error messages, consistent navigation).
4. **Robust:** Content must use valid, semantic markup (`aria-*`, roles, labels) so current and future assistive technologies like screen readers interpret it reliably.

---

### 9. Why is semantic HTML important for accessibility?
Semantic HTML elements (`<button>`, `<label>`, `<input>`, `<nav>`, `<main>`, `<h1>`) provide built-in keyboard behaviour, focus management, and accessibility-tree roles out of the box. For example, a native `<button>` automatically supports `Tab` focus and `Enter`/`Space` activation and announces `"button"` to screen readers, whereas a `<div onClick={...}>` is invisible to keyboard navigation and screen readers unless manually retrofitted with `tabIndex`, keydown listeners, and ARIA attributes.

---

### 10. Tell me about a time you disagreed with what a customer wanted to build.
During the design of the Swash authentication and enquiry flow, an initial proposal suggested collecting multiple split name fields, date of birth, and a separate "special item quotation" form alongside registration, while hiding the submit button until all fields passed validation. I pushed back with evidence from the Swash business brief and WCAG guidelines: busy Lagos professionals on unstable connections abandon bloated forms, and hiding the submit button confuses keyboard and screen-reader users. We agreed to consolidate name entry, restrict fields to operationally justified data (`fullName`, `email`, `phone`, `servicePlan`, `password`, `acceptTerms`), and keep the submit button visible but disabled until valid.

---

### 11. How would you explain a poorly performing AI implementation to a non-technical executive?
I would avoid jargon like "context window" or "vector embeddings" and frame it around business reliability and cost: *"Right now, our AI assistant is like a new call-centre agent who hasn't been given Swash's official price list or the customer's order file—so it takes too long searching through everything, costs more per question, and sometimes guesses the wrong answer. By connecting it directly to our verified database records and approved policies first, it answers faster, costs less, and never invents prices or order statuses."*

---

### 12. Which validation rule could wrongly block a legitimate Swash customer?
Two rules in `src/components/AuthForm.tsx` have real-world false-positive trade-offs:
1. **The `fullName` character pattern (`/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,79}$/`):** Blocks customers who include a period in a title (`"Dr. Chukwu"`), use a single-letter legal mononym, or type Yorùbá characters with combining sub-dots (`ẹ`, `ọ`, `ṣ`).
2. **The Nigerian mobile number rule (`/^(?:0[789][01]\d{8}|\+234[789][01]\d{8})$/`):** Blocks expatriates or diaspora visitors in Lagos who only have a foreign mobile number (`+44` or `+1`).

---

### 13. What happened when you sent a request directly to your endpoint?
When I sent a `POST` request directly to `http://127.0.0.1:3007/api/auth` using `curl.exe` with invalid data (`fullName: "A"`, `email: "not-an-email"`, `phone: "123"`, `password: "          "`, and `acceptTerms: false`), the server returned `HTTP 201 Created` and inserted the invalid record directly into PostgreSQL (`evidence/16-direct-request-command-and-response.txt`). Because all validation in Task 03 lived in the React client component, bypassing the browser bypassed every check.

---

### 14. Why is a strong frontend validation system not a substitute for backend protection?
Frontend validation runs on untrusted client hardware after the code has left the server. It exists to guide honest users quickly and accessibly—preventing typos, preserving input on slow networks, and announcing errors to screen readers. Backend protection runs in the trusted server environment right before database writes. Without backend validation, any script, modified client, or `curl` command can inject invalid, unaccepted, or malicious data straight into PostgreSQL.

---

### Bonus: User Enumeration and How Error Messages Contribute to It
**User enumeration** occurs when an application reveals—through error wording, HTTP status codes, or response timing—whether a specific email address or phone number is registered. For example, if `/auth?mode=login` returns *"No account found for adaeze@example.com"* vs. *"Incorrect password for adaeze@example.com"*, an attacker can probe thousands of Nigerian email addresses to build a verified list of Swash customers for credential stuffing or targeted phishing. To prevent this, login and password-reset flows must use generic messages (*"Invalid email or password"* / *"If an account exists for that email, a reset link has been sent"*).
