const react = require('react')
const ReactDOMServer = require('react-dom/server')
const bodyParser = require('body-parser')

const express = require('express')
const session = require('express-session')
require('node-jsx').install()

const morgan = require('morgan')

const app = express()
const fetch = require('node-fetch');

const queryString = require('query-string');
const cheerio = require('cheerio');
const fs = require('fs');
const FormData = require('form-data');

app.use(morgan('combined'))
app.use(express.static(`${__dirname}/public`))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))



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
        return eventbriteIframeTemplate;
      })

      var html = fs.readFileSync(__dirname + '/app/html/training.html');
      var $ = cheerio.load(html);

      $('#eventbrite-events').append(iframes.join(''));

      // process the event data, and transform them to contains data that client needs
      const processedEventData = eventsData.map(eventData => {
        const { id, start: { local: startDate }, address: { region, localized_address_display } } = eventData;
        return { id, startDate, region, localized_address_display };
      });
      const eventDataInject = `<script>window.eventsData = ${JSON.stringify(processedEventData)}</script>`
      $('body').prepend(eventDataInject);
      res.send($.html());
    });
});

const DonationPages = require('./pages/donation.jsx')
const DonationActions = require('./src/donation.js')

app.get('/donation/:step', (req, res) => {
  var step = req.params.step
  if (step in DonationPages.Steps) {
    res.set('content-type', 'text/html')
    var form = req.session.form || {steps: [false, false, false, false]}

    var targetStepIndex = DonationActions.StepsIndex[step]
    var redirectIndex = DonationActions.ensureSteps(form, targetStepIndex)
    if (redirectIndex < targetStepIndex) {
      res.redirect(DonationActions.URLs[DonationActions.IndexToSteps[redirectIndex]])
    }

    // clear session when finished
    if (step == 'confirmation') {
      req.session.form = undefined
    }

    const element = react.createElement(DonationPages.Steps[step], {form: form})
    const stream = ReactDOMServer.renderToStaticNodeStream(element)
    stream.pipe(res)
  } else {
    // 404 page
    res.status(404).send('Not found')
  }
})

app.post('/donation/:step', (req, res) => {
  var step = req.params.step
  if (step in DonationActions.Actions) {
    DonationActions.Actions[step](req, res)
  } else {
    res.status(404).send('Not found')
  }
})

// createdb tha
const sql = require('sql-template-strings')
const pg = require('pg')
const pool = new pg.Pool({
  database: 'tha'
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
})

const withDb = (req, res, next) => {
  pool.connect((err, client, done) => {
    if (err) return next(err)
    req.db = client
    const finished = () => { if (done) { done(); done = null } }
    res.on('finish', finished)
    res.on('close', finished)
    next()
  })
}

app.get('/dbtest', withDb, (req, res, next) => {
  req.db.query(sql`SELECT NOW()`, (err, result) => {
    if (err) return next(err)
    //console.log(err, result.rows[0])
    res.send(result.rows[0])
  })
})

const port = process.env.PORT || 3939
require('http').createServer(app).listen(port)
console.log(`server listening on http://localhost:${port}/`)
