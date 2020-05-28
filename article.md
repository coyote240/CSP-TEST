# Understanding and Applying the Content Security Policy

## Overview

Cross-site Scripting (XSS) is far from dead, whatever you may have heard, but
the tools of its destruction have been wrought. While popular client-side web
frameworks help to provide out-of-the-box input validation and output filtering,
browser vendors have expanded capabilities that provide developers with tight
controls with which to control script execution. These tools do not come for
free, however, and their use is subtle and challenging; there is risk of cutting
one's self in the process.

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

It is important to note that for any content types where we have not defined a
directive, the `default-src` directive will be applied.

```
Content-Security-Policy: default-src 'self'; img-src images.example.com; script-src 'self' https://code.jquery.com; font-src https://fonts.googleapis.com;
```

With this policy applied, we now have more strict control over the delivery of
fonts and scripts from third parties, while limiting other media types to those
hosted on our web server. For fonts, images and similar static content, these
simple polices address the majority of our concerns. For scripts, however,
things get a bit more complex.

### In the Interest of Safety

In addition to specifying URLs, the `script-src` directive gives the developer
control over scripts being run from `<script>` tags, event attributes and other
inline locations within an HTML document. This is where protecting against
reflected XSS becomes especially critical. Code cannot execute from an XSS
payload if the browser restricts it. By default, the `script-src` directive
prevents the use of `eval`, `Function()` and the passing of string literal code
to methods like `window.setTimeout()` and `window.setInterval()`. It also
restricts the use of the `<script>` tag to the `head` of the document. Right
away, these limitations shuts down the majority of potential XSS threats.

Occasionally, though, we need to enable careful use of these features, and the
`script-src` directive allows for this.

```
Content-Security-Policy: default-src 'self'; script-src 'unsafe-eval'
'unsafe-inline';
```

By enabling `unsafe-eval`, we allow use of the `eval` function as described
above. Similarly, by enabling `unsafe-inline`, we allow the use of inline script
tags, event handlers and style elements. While there are clear use cases for
enabling `unsafe-inline`, it is recommended that `unsafe-eval` be universally
avoided.

## Reporting Violations

Notification of policy violations are not sent by default. This can be a problem
for a couple of reasons. First, as establishing an effective Content Security Policy
is a complex endeavor, it is imporant that we receive timely feedback if we've
blocked too much. Second, policy violation reports could be an indicator that an
attacker is looking for or has found a way to reflect an XSS payload into our
application. In either case, visibility is key.

Enabling reporting will require some additional work on the server side. When
reporting is enabled, the browser will send a structured JSON payload to a
specified endpoint containing details of policy violations as they occur. The
Content Security Policy specification does not define how violation reports are
received or processed, so how this is done will depend on the needs of your
organization. This could be as simple as logging the raw JSON to a file, or
saving the content to a custom database or Prometheus instance.

Reporting may be added to any Content Security Policy by including a
`report-uri` directive. The `report-uri` directive references an HTTP endpoint,
which can be a path relative to your domain.

```
Content-Security-Policy: default-src 'self'; img-src images.example.com; report-uri /csp/;
```

When a policy is violated, a report is POSTed to the directive endpoint. Note
that the report may be sent with a MIME type of either `application/json` or
`application/csp-report` depending on browser version.

Content Security Policy is an evolving standard, and thus the `report-uri`
directive has been deprecated in favor of the potentially more robust
`report-to` directive. However, `report-to` has limited support, where
`report-uri` still seems to be supported by all major browsers at the time of
this writing. While I was doing my research for this article, I was unable to
get Chrome to send any violation reports using the `report-to` directive. Should
you decide to implement reporting, be prepared for this change in the future.

It is possible to deploy a Content Security Policy in report-only mode. In this
case, no content is blocked, but a report is sent whenever a policy directive is
violated. This can greatly ease the adoption of Content Security Policy,
particularly on an established site.

## A Process Towards Adoption

As we've described above, the Content Security Policy header is a powerful tool
in the fight against malicious user content and behavior in the browser. This
power, however, comes with complexity, and a mistake in a policy can easily
break an existing site.

### Start with the Basics

default-src 'self', disable 'unsafe-\*'

### If You See Something, Say Something

Report only

### Tighten the Reins

Adjust the policy to reflect usage while starting to remove unsafe code

### Lock It Down!

## Summary

## References

* [CSP Violation Report Syntax](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#Violation_report_syntax)
