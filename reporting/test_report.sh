#!/usr/bin/env bash

REPORT=$(tr '\n' ' ' <<'EOR'
{
  "csp-report": {
    "document-uri": "http://example.com/signup.html",
    "referrer": "",
    "blocked-uri": "http://example.com/css/style.css",
    "violated-directive": "style-src cdn.example.com",
    "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports"
  }
}
EOR
)

curl -X POST \
  -d "${REPORT}" \
  -H "Content-Type: application/json" \
  -x http://localhost:8080 \
  localhost:8000/reporting/
