const express = require('express')
const app = express()
const fetch = require('node-fetch');

const queryString = require('query-string');
const cheerio = require('cheerio');
const fs = require('fs');

app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.send('oh hai')
})

app.get('/training', function(req, res) {
  const apiUrl = 'https://www.eventbriteapi.com/v3/users/me/owned_events';
  const query = { token: 'QHZIGQMTINSSRO2NP7QU' };

  const url = `${apiUrl}?${queryString.stringify(query)}`;
  const ids = fetch(url)
    .then(resp => resp.json())
    .then(json => {
      // getting the event ids
      return json.events.map(event => event.id);
    })
    .then(ids => {
      // TODO: find better way
      // do hacky way injecting iframes to the HTML templates

      const iframes = ids.map(id => {
        const eventbriteIframeTemplate = `
          <div style="width:100%; text-align:left;">
            <iframe src="//eventbrite.com.au/tickets-external?eid=${id}&ref=etckt" frameborder="0" height="400" width="100%"
              vspace="0" hspace="0" marginheight="5" marginwidth="5" scrolling="auto" allowtransparency="true"></iframe>
            <div style="font-family:Helvetica, Arial; font-size:12px; padding:10px 0 5px; margin:2px; width:100%; text-align:left;">
              <a class="powered-by-eb" style="color: #ADB0B6; text-decoration: none;" target="_blank" href="http://www.eventbrite.com.au/">Powered by Eventbrite</a>
            </div>
          </div>
        `
        return eventbriteIframeTemplate
      })

      var html = fs.readFileSync(__dirname + '/app/html/training.html');
      var $ = cheerio.load(html);

      $('#eventbrite-events').append(iframes.join(''));
      res.send($.html());
    });
});

require('http').createServer(app).listen(3939)
console.log('server listening on http://localhost:3939')
