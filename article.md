# Understanding and Applying the Content Security Policy

## Overview

Cross-site Scripting (XSS) is far from dead, whatever you may have heard, but
the tools of its destruction have been wrought. While popular client-side web
frameworks help to provide out-of-the-box input validation and output filtering
while browser vendors have expanded capabilities that provide developers with
tight controls with which to control script execution. These tools do not come
for free, however, and their use is subtle and challenging; there is risk of
cutting one's self in the process.

One of the most powerful weapons in the battle against XSS is the Content
Security Policy (CSP). While the CSP might be everything we need to stop XSS in
its tracks, it is complex and requires skill and practice to master.

## Abandoning X-XSS-Protection

For a time, Internet Explorer, Chrome and Safari had begun to introduce the
**X-XSS-Protection** header which was intended to detect reflected XSS attacks
in the browser. While use of the header was simple for developers it proved
exceedingly difficult for browser vendors to maintain. With many known
techniques available to bypass XSS protections, the effort was abandoned.

Though penetration testers until recently recommended the use of the
X-XSS-Protection header in their reports, the header is no longer supported in
current browsers and its use should be discouraged in favor of a strong Content
Security Policy.

## Policies, Directives, Sources

The purpose of the Content Security Policy is to specify to the browser from
which network locations scripts, styles and other media may be downloaded for a
site, as well as in which contexts scripts maybe executed. One example may be
delivering a large JavaScript framework like jQuery or Angular via a CDN, or
including custom fonts from Google. There may be more than just a site's home
domain participating in a web application. Developers require a means to keep
this under control.

### A Reasonable Default

The `Content-Security-Policy` header contains a **policy** which is made up of
**directives**. Each directive specifies the sources from which a site may
consume resources. The simplest policy, for example, restricts content to only
the scheme, domain and port from which the page was delivered.

```
Content-Security-Policy: default-src 'self';
```

In this example, we have one fetch directive, `default-src`. A fetch directive
controls which locations from which certain resource types may be loaded. We'll
describe some of the various fetch directives later, but the `default-src` acts
as a baseline for other directives in the policy. All fetch directives, if not
otherwise defined, will fall back to `default-src`.

`self` refers to the domain where the document originated. This includes URL
scheme and port number. If we wanted to serve images from a separate subdomain
than that which delivered the document, we would need to alter our policy to
accommodate.

```
Content-Security-Policy: default-src 'self' images.example.com;
```

### A Directive for All Seasons

Now, while our policy does allow us to load content from the image.example.com
domain, it doesn't restrict what *kinds* of content we want to load. Thus, all
content served from image.example.com is accepted. If our image domain were
compromised, an attacker could upload malicious JavaScript. Fortunately, we can
add an additional fetch directive that will only allow images to be downloaded
from that domain.

```
Content-Security-Policy: default-src 'self'; img-src images.example.com;
```

Now content may only be retrieved from `self`, with the exception of images,
which may be pulled from images.example.com. The CSP provides a number of fetch
directives for a variety of media types, such as fonts, styles and specifically
scripts.

One common example is to allow for the loading of JavaScript frameworks from a
CDN. As frameworks like React, Angular and jQuery are ubiquitous, it is not
uncommon to have an application download these from a common source, share that
cached copy across multiple sites in the user's browser. This is also common for
sites that use custom fonts. This use case requires a couple more directives.

```
Content-Security-Policy: default-src 'self'; img-src images.example.com; script-src 'self' https://code.jquery.com; font-src https://fonts.googleapis.com;
```

## In the Interest of Safety


## Reporting Violations


## A Process Towards Adoption
