// Throw-away request to get the server's headers.
fetch('dummy.json').then(response => {
  return response.headers;
}).then(headers => {
  return {
    xxss: headers.get('X-XSS-Protection'),
    csp: headers.get('Content-Security-Policy')
  };
}).then(proceed);



function proceed (headers) {
  let {xxss, csp} = headers;
  console.log(headers);

  if(xxss) {
    document.body.classList.add('x-xss-protection');
  }

  if(!csp) {
    document.body.classList.add('site-without-policy');
  }

  injectQuery();
}

function injectQuery () {
  let here = new URL(document.location);
  let query = here.searchParams.get('query');
  let links_list = document.getElementById('links');
  let links = links_list.getElementsByTagName('a');

  let target = document.getElementById('target');
  target.innerHTML = query;

  for(let i = 0; i < links.length; i++ ) {
    links[i].search = here.search;
  };
}
