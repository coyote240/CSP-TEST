# Content Security Policy and the end of X-XSS-Protection

## Build

```shell
docker build -t nginx-csp-test .
```

## Run

```shell
docker run --name nginx-csp-test \
           --rm \
           -p 8080 \
           nginx-csp-test
```

or use the included run script:

```shell
./run.sh
```

Then open your browser to http://localhost:8080.

Or, do demonstrate a simple XSS and how the various header configurations do or
don't affect the browser:

http://localhost:8080/x-xss-protection-block/?query=%3Cimg%20src=%27null%27%20onerror=alert(1)%3E

Each of the links at the bottom of the page will contain your search parameters.
Each of the links points to a different directory on the server, with XSS
protection headers configured as displayed.
