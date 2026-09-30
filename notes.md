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

## React

Interesting things I have learned about React
