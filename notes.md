# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.axontradinghouse.click)
- [My simon](https://simon.axontradinghouse.click)


## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

Region lock-in — the AMI dependency means everything must happen in us-east-1.
Protect your key — lose the .pem and your only recovery is terminating and rebuilding the server; never expose it publicly.
Stop ≠ Terminate — stopping pauses billing and preserves the instance; terminating destroys it.
Security groups define what ports and source IPs are allowed; "from anywhere" is fine for a class project, but the principle is that you can restrict access tightly in production.
IP stability matters for anything you want others to reliably reach — hence elastic IPs.
Servers are disposable and re-sizable — with an elastic IP you can change instance size or rebuild freely without losing your address, and future changes to the server are meant to happen through automated CI, not manual edits.

## HTML

"<>" indicates a tag. "</p>" the forward slash indicates that it's a closing tag. 
HTML relies on CSS for styling. HTML is all about structure. 
Elements can have attributes. 
Attributes: id - allows distinction between elements. class - attribute element as being classified into a named group of elements. 
Hyperlinks are at the core of HTML - allowing to move between pages.
HTML also able to take in user data. Form element is especially key.
Forms rely on actions and methods to function.  
Use POST for sensitive input. 
Relative references are preferable to reduce adjustments needed. 
Automatically playing audio is strongly discouraged. 
Document Object Model (DOM) turns HTML into a tree structure the machine can parse. The DOM is what JavaScript and CSS interact with to do their work. 
Inspect or view source after right-clicking to see the code backbone of any website. 

### From building the startup HTML

Every page shares the same frame: header, nav, main, footer. Copying that frame into each page is the cost of having no templating yet — React components fix this later.
With no JavaScript, a form's action attribute is the navigation: the login form's action="screener.html" is what "logs in".
A GET form puts every named input in the URL, so sensitive fields like passwords belong in a POST form, which sends them in the request body. An input without a name attribute is not submitted at all.
Give multiple submit buttons in one form distinct name and value attributes (name="action" value="login" / "register") so the server can tell which was clicked.
A static file server only answers GET, so a POST form has nowhere to land until there is a backend endpoint to receive it.
A button can submit a form it isn't inside by using form="form-id".
Tables: thead/tbody, th scope="col" for column headers, th scope="row" for the ticker in each row, and caption to describe the table.
details/summary gives a collapsible section with no JavaScript — used for each metric's formula.
meter shows a value within a known range (coverage from 0 to 1); progress is for a task completing.
abbr title="..." gives a hover tooltip — used to explain why a value is missing.
fieldset + legend group related form controls; label for="id" ties a label to its input.
img needs alt text. SVG files work as images and stay sharp at any size.
deployFiles.sh copies everything in the folder (scp -r *) to the server, so keys and anything private must live outside the project folder. Dotfiles are skipped by *.

## CSS

Defines rulesets and rules. 
Rules uses selector to choose which elements to apply the rule to. 
Declaration represents the property to style with given property value.
CSS defines everything with boxes. 
Selectors can cascade declaration down children in a body/section.
CSS has an Animation property. 
Bootstrap is the legacy package for CSS programming.
Tailwind is now very popular now.

Load order matters only for ties. main.css loads after Bootstrap so it wins when two selectors are equally specific, but a more specific selector wins no matter the order. Bootstrap's `.nav-pills .nav-link.active` (three classes) beat my `header .nav-link[aria-current]` (two classes and an element) until I added `.nav-pills` to mine.
Specificity counts IDs, then classes/attributes/pseudo-classes, then elements. `#screener main` beats `main`, which is how each page's rules stay scoped to that page.
Bootstrap 5.3 components are driven by CSS custom properties (`--bs-btn-bg`, `--bs-table-bg`, `--bs-card-bg`, `--bs-alert-bg`). Setting those is cleaner than overriding its selectors.
`data-bs-theme="dark"` on `<html>` switches Bootstrap to its dark color mode.
Custom properties on `:root` (`--bg`, `--accent`, `--neg`) give one place to change the whole palette.
The SRI `integrity` hash on a CDN link makes the browser refuse the file if its contents ever change. Compute it with `openssl dgst -sha384 -binary file | openssl base64 -A`.
Google Fonts: a `preconnect` to fonts.googleapis.com and fonts.gstatic.com, then the css2 stylesheet link. `font-variant-numeric: tabular-nums` makes every digit the same width so numbers line up in a column.
Sticky footer: body as a flex column with `min-height: 100vh`, and `main` with `flex: 1`.
Grid can place items without moving the HTML: `grid-column` and `grid-row` put the live updates box in the right column even though it comes after the table in the file. `repeat(auto-fill, minmax(15rem, 1fr))` fits as many columns as the width allows.
`width: min(100% - 2rem, 1200px)` with `margin-inline: auto` gives a centered column with a 1rem gutter on small screens.
Radios and checkboxes can look like buttons with no JavaScript: Bootstrap's `btn-check` hides the input and styles its `label` as a button. They are still real inputs, so the form submits the same way.
Bootstrap's navbar collapse (hamburger) needs Bootstrap's JavaScript, so without JS the nav just wraps with flexbox.
`.table-responsive` makes a wide table scroll sideways inside its own box instead of making the whole page scroll. `position: sticky; left: 0` pins the first column while it scrolls.
Media queries plus `:nth-child()` can hide less important table columns on a phone: `tr > :nth-child(3) { display: none }` hides the third cell of every row, header included.
Pseudo-elements add content with no HTML: `::before` draws the live dot and the formula arrow, `::marker` colors list numbers, and `::-webkit-meter-bar` / `::-moz-meter-bar` style a `<meter>`.
Attribute selectors react to state: `details[open] summary::before` rotates the arrow when a formula is open. They can also match more than intended: `img[src$='.svg']` matched the logo too, until I scoped it to `main`.
`:has()` selects a parent by its children: `td:has(meter)`.
`@keyframes` plus `animation` runs with no JavaScript, and `@media (prefers-reduced-motion: reduce)` turns it off for people who ask for less motion.
Buttons inherit font from their cell if the cell sets one, so a monospace table cell made the Remove buttons monospace.
Checking "no overflow": `document.documentElement.scrollWidth` should equal `innerWidth`. Headless Chrome will not make a window narrower than 500px, so test phone width inside a 375px-wide iframe.

## JavaScript

3 ways to insert JavaScript into HTML: 
1. Script block
2. External code (src attribute)
3. Inline event attribute

Node.js allows JavaScript to be run on servers, outside browsers. 

Anonymous functions are useful for passing a function into another function as a parmeter.
Arrow functions allow for implicit returns, abbreviating return commands. 
"This" functions are the most important divergence in how arrow and normal functions operate. 
JavaScript arrays include dynamic sizing
Destructuring = pulling items out of an object
Hooks are special functions that allow functional components to access the React state

JSON = JavaScript Object Notation
Dates expressed through strings with standardized notation.

## React

React is component-based, so you can construct web programs more like building blocks instead of unitary scripts. 

JSX provies the ability to represent HTML manipulated by JavaScript.
Components generate the user interface.
Components can be linked in a tree structure.
React uses a Virtual DOM compares the new JSX output and old output and figures out the most efficient way to update the web program. 

Router defines the routes a user can take through the application. 

props, state, and render are key aspects of React that allow it to change programs in response to user input.


## Startup React P1: Routing

What I learned converting the HTML/CSS startup to React with Vite:

Vite wants `index.html` at the project root with a `<div id="root">` and a `<script type="module" src="/index.jsx">`. `index.jsx` mounts `<App />` into `#root`.

Files in `public/` are served as-is at `/` (`/logo.svg`). Small images that are `import`ed get inlined as data URIs instead, which can break selectors like `img[src$='.svg']`.

Vite's dev server serves `about.html` for `/about` if that file still exists, so the old HTML page shadows the React route. Delete each old page once it's ported.

JSX differences from HTML: `class` → `className`, `for` → `htmlFor`, every tag must close (`<input />`, `<br />`), comments are `{/* */}`, and uncontrolled inputs use `defaultChecked` / `defaultValue`.

JSX drops whitespace at a line break between text and a tag, so `on it.` followed by `<b>Kind</b>` on the next line renders as `on it.Kind`. Use `{' '}`.

React renders inside `#root`, not `body`, so layout rules on `body` (my flex page frame) have to move to a wrapper element.

With one `body` for every view, page-scoped CSS like `#screener main` stops working. I put the id on each view's `<main>` and changed the selectors to `main#screener`.

`NavLink` adds the `active` class and `aria-current="page"` to the link for the current route, so the existing nav pill styles kept working.

A `<Routes>` block can go anywhere, not just around the page body. I used one in the header to hide "Signed in as" on the login route.

Rendering repeated rows from an array with `.map()` needs a unique `key` on each element.

Deploying: `deployReact.sh` runs `npm run build` and copies only `dist/` to the server.

## Simon React P2: Reactivity

What I learned from studying the reactive Simon (`simon-react`):

`useState` returns `[value, setValue]`. Calling the setter re-renders the component; assigning to a plain variable does not.

Setters are asynchronous, so code that depends on the new value goes in a `useEffect` that lists that value as a dependency. Simon plays the sequence in an effect on `[sequence]` instead of right after `setSequence`.

`useEffect(fn, [])` runs once after the first render. About uses this to set its image and quote, standing in for the fetch calls that come with the service.

Returning a function from `useEffect` gives cleanup on unmount. Players adds a handler to `GameNotifier` and removes it in the cleanup so handlers don't pile up on each visit to Play.

State that several views need (`userName`, `authState`) lives in `App` and is passed down as props, with a callback (`onAuthChange`) so children can change it. That is "lifting state up".

Conditional rendering with `{cond && <Component />}`: Login shows Authenticated or Unauthenticated based on `authState`, and the nav only shows Play and Scores when logged in.

`localStorage` holds the mock data for now: `userName` marks the user as logged in on the next visit, and `scores` is a JSON array that Play writes and Scores reads.

The WebSocket is mocked with `setInterval` in `gameNotifier.js`, which broadcasts a fake score every 5 seconds.

A child's methods can be called through a ref: SimonGame calls `btn.ref.current.press()` on each SimonButton.

## Startup React P2: Reactivity

What I learned making the startup reactive:

Hard-coded data behind async functions (`getMetrics()`, `getScreener()`) makes the service swap easy later: the views already load in `useEffect` and `.then(setState)`, so only the function bodies change when they become `fetch` calls.

An uncontrolled `<select defaultValue>` only applies its default on the first render. If the options arrive later from an effect, the default is lost. Controlled inputs (`value` + `onChange`) don't have this problem.

Data that arrives in an effect is empty on the first render. Code like `columns.map((id) => metrics.find(...).name)` crashes then, so derive from the loaded array (`metrics.filter(...)`) or guard until it has loaded.

Store numbers, format at render. Strings like `'55.8%'` can't be sorted or ranked, so the sample data holds `0.558` and a `formatValue(value, unit)` helper turns it into text.

Keeping related settings in one state object (the screener setup: columns, sort, order, view) makes it easy to save, restore, and save under a name. Update it with a copy: `onChange({ ...setup, sort: id })`.

`useState(() => readSetup(userName))` takes a function so localStorage is only read on the first render, not every render.

A `useEffect` on `[userName, setup]` saves the setup to localStorage every time it changes, so the screener reopens the way it was left.

`setInterval` in a `useEffect` must return `() => clearInterval(timer)`, or a new feed starts every time the screener opens. Adding `paused` to the dependency list stops and restarts it.

The interval callback only sees the state from the render that started it. A `useRef` that is updated every render (`rowsRef.current = rows`) lets it read the latest rows without restarting the feed. Setters that take a function (`setRows((current) => ...)`) also always see the latest value.

To replay a CSS animation on an element that already exists, change its `key` so React mounts a fresh one.

`useNavigate` also works for moving between views after an action, not just after a login form: adding a metric to the screener, or opening a saved setup.

A form's `onSubmit` with `event.preventDefault()` makes Enter work in a text box without reloading the page.

Things that will be real later and are mocked now: accounts and the watchlist live in localStorage under per-user keys, Finnhub data is the 2025-06-30 sample, and the WebSocket is a `setInterval` price feed.
