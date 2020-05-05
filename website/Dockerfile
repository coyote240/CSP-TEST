FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY html /usr/share/nginx/html/
COPY html /usr/share/nginx/html/x-xss-protection/
COPY html /usr/share/nginx/html/x-xss-protection-block/
COPY html /usr/share/nginx/html/x-xss-protection-off/
COPY html /usr/share/nginx/html/csp-default-self/
COPY html /usr/share/nginx/html/csp-default-none/
COPY html /usr/share/nginx/html/csp-default-unsafe-inline/
COPY html /usr/share/nginx/html/csp-default-self-unsafe-inline/
