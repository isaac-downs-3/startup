# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.cs260.click)
- [My simon](https://simon.cs260.click)

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

Interesting things I have learned about HTML

## React

Interesting things I have learned about React
