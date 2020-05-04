// Throw-away request to get the server's headers.
fetch('dummy.json').then(response => {
  return response.headers;
}).then(headers => {
  let xxss = document.createTextNode(headers.get('X-XSS-Protection'));
  document.getElementById('x-xss-value').append(xxss);

  let csp = document.createTextNode(headers.get('Content-Security-Policy'));
  document.getElementById('content-security-policy').append(csp);
}).then(proceed);

let here = new URL(document.location);
let query = here.searchParams.get('query');
let links_list = document.getElementById('links');
let links = links_list.getElementsByTagName('a');

for(let i = 0; i < links.length; i++ ) {
  links[i].search = here.search;
};

let target = document.getElementById('target');
target.innerHTML = query;

function proceed () {
}

function updateLinks () {
}

function injectQuery () {
}
