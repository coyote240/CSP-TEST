# Content Security Policy and the end of X-XSS-Protection

## Run

```shell
docker-compose up
```

Then open your browser to http://localhost:8080.

Or, do demonstrate a simple XSS and how the various header configurations do or
don't affect the browser:

http://localhost:8080/x-xss-protection-block/?query=%3Cimg%20src=%27null%27%20onerror=alert(1)%3E

Each of the links at the bottom of the page will contain your search parameters.
Each of the links points to a different directory on the server, with XSS
protection headers configured as displayed.


## Build

If you decide to modify the containers used in this project, you will need to
rebuild the images:

```shell
docker-compose up --build
```

## Tear Down

```shell
docker-compose down
```


## Features

* Selection of multiple configurations
* Reporting endpoint
