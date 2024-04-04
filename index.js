const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const SERVER = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      //http code, header
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      //http code, header
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      //http code, header
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.write('<h1>Page not found!</h1>');
    res.write('<p>Try again!</p>');
    res.write('<a href="/">Back to home</a>');
    res.end();
  }
});

SERVER.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
