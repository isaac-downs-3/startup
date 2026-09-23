# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.axontradinghouse.click)
- [My simon](https://simon.axontradinghouse.click)

I love web programming

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
A GET form puts every named input in the URL. An input without a name attribute is not submitted, which keeps the placeholder password out of the address bar.
A button can submit a form it isn't inside by using form="form-id".
Tables: thead/tbody, th scope="col" for column headers, th scope="row" for the ticker in each row, and caption to describe the table.
details/summary gives a collapsible section with no JavaScript — used for each metric's formula.
meter shows a value within a known range (coverage from 0 to 1); progress is for a task completing.
abbr title="..." gives a hover tooltip — used to explain why a value is missing.
fieldset + legend group related form controls; label for="id" ties a label to its input.
img needs alt text. SVG files work as images and stay sharp at any size.
deployFiles.sh copies everything in the folder (scp -r *) to the server, so keys and anything private must live outside the project folder. Dotfiles are skipped by *.

## React

Interesting things I have learned about React
