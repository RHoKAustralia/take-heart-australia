const express = require('express')
const app = express()
const fetch = require('node-fetch');

const queryString = require('query-string');
const cheerio = require('cheerio');
const fs = require('fs');
const FormData = require('form-data');

app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.send('oh hai')
})

app.get('/training', function(req, res) {
  const apiUrl = 'https://www.eventbriteapi.com/v3/users/me/owned_events';
  const EVENTBRITE_TOKEN = 'QHZIGQMTINSSRO2NP7QU';
  const tokenQuery = { token: EVENTBRITE_TOKEN };
  const getEventsQuery = Object.assign({}, tokenQuery, { status: 'live' });

  let eventsData;

  const url = `${apiUrl}?${queryString.stringify(getEventsQuery)}`;
  const ids = fetch(url)
    .then(resp => resp.json())
    .then(json => {
      // store the eventData
      eventsData = json.events;

      // get location data for each event
      const venueIds = json.events.map(event => event.venue_id);
      const batchedRequests = venueIds.map(venueId => {
        return {
          method: 'GET',
          relative_url: `venues/${venueId}`
        }
      });
      const batchUrl = `https://www.eventbriteapi.com/v3/batch/?${queryString.stringify(tokenQuery)}`
      console.log('req', batchedRequests)

      const form = new FormData();
      form.append('batch', JSON.stringify(batchedRequests));

      return fetch(batchUrl, {
        method: 'POST',
        body: form,
      })
    })
    .then(resp => resp.json())
    .then(batchedJson => {
      // mutate eventsData and add address file for each of them
      batchedJson.forEach((resp, index) => {
        const parsedBody = JSON.parse(resp.body)
        console.log('event data', parsedBody.address)
        eventsData[index].address = parsedBody.address;
      })
    })
    .then(() => {
      // TODO: find better way
      // do hacky way injecting iframes to the HTML templates

      // getting the event ids
      const ids = eventsData.map(event => event.id);

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

      const eventDataInject = `<script>window.eventsData = ${JSON.stringify(eventsData)}</script>`
      $('body').prepend(eventDataInject);
      res.send($.html());
    });
});

require('http').createServer(app).listen(3939)
console.log('server listening on http://localhost:3939')
