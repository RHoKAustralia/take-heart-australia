const react = require('react');
const ReactDOMServer = require('react-dom/server');
const bodyParser = require('body-parser');

const express = require('express');
const session = require('express-session');
require('node-jsx').install();

const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null }
}))

app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile)

app.get('/', (req, res) => {
  res.send('oh hai');
});

/* Start of Training Routes */
const fetch = require('node-fetch');

const queryString = require('query-string');
const cheerio = require('cheerio');
const fs = require('fs');
const FormData = require('form-data');

app.get('/training', function(req, res) {
  // declare variables to make a request to Eventbrite API
  // https://www.eventbrite.com/developer/v3/
  const apiUrl = 'https://www.eventbriteapi.com/v3/users/me/owned_events';
  const EVENTBRITE_TOKEN = 'QHZIGQMTINSSRO2NP7QU';
  const tokenQuery = { token: EVENTBRITE_TOKEN };
  // only select 'live' events
  const getEventsQuery = Object.assign({}, tokenQuery, { status: 'live' });

  let eventsData;

  // first, get the list of owned events and live by take-heart-australia Eventbrite account
  // https://www.eventbrite.com/developer/v3/endpoints/users/#ebapi-get-users-id-owned-events
  // https://www.eventbrite.com/developer/v3/quickstart/
  const url = `${apiUrl}?${queryString.stringify(getEventsQuery)}`;
  const ids = fetch(url)
    .then(resp => resp.json())
    // here `json` is the events data returned from `Eventbrite`
    // it will return an Array of `Event` object https://www.eventbrite.com/developer/v3/response_formats/event/#ebapi-std:format-event
    .then(json => {
      // store the eventsData for later usage
      eventsData = json.events;

      // get venue_id for each event
      const venueIds = json.events.map(event => event.venue_id);
      const batchedRequests = venueIds.map(venueId => {
        return {
          method: 'GET',
          relative_url: `venues/${venueId}`
        };
      });

      // create a batch request to Eventbrite API to retrieve address data from venue_id
      // https://www.eventbrite.com/developer/v3/api_overview/batching/
      const batchUrl = `https://www.eventbriteapi.com/v3/batch/?${queryString.stringify(tokenQuery)}`;

      const form = new FormData();
      form.append('batch', JSON.stringify(batchedRequests));

      return fetch(batchUrl, {
        method: 'POST',
        body: form
      });
    })
    .then(resp => resp.json())
    .then(batchedJson => {
      // mutate eventsData and add address file for each of them
      batchedJson.forEach((resp, index) => {
        const parsedBody = JSON.parse(resp.body);
        eventsData[index].address = parsedBody.address;
      });

      // read the html for training.html and parse it using cheerio
      var html = fs.readFileSync(__dirname + '/app/html/training.html');
      var $ = cheerio.load(html);

      // process the event data, and transform them to only contains data that client needs
      // from `Event` + `address` field, to just `{ id, startDate, region, localized_address_display }`
      // this will be the one that send to client
      const processedEventData = eventsData.map(eventData => {
        const { id, start: { local: startDate }, address: { region, localized_address_display } } = eventData;
        return { id, startDate, region, localized_address_display };
      });

      // inject the processed data into the response `html` using cheerio
      const eventDataInject = `<script>window.eventsData = ${JSON.stringify(processedEventData)}</script>`;
      $('body').prepend(eventDataInject);

      // then send the training.html with injected-processed-upcoming-events-data from Eventbrite
      res.send($.html());
    });
});

/* End of Training routes */

const DonationPage = require('./pages/donation.jsx')
const Donation = require('./src/donation.js')

app.get('/donation', (req, res) => {
  res.redirect('/donation/options')
})

app.get('/donation/:step', (req, res) => {
  var step = req.params.step
  var message = req.query.message
  if (step in DonationPage.Steps) {
    res.set('content-type', 'text/html')
    var form = req.session.form || {steps: [false, false, false, false]}

    var targetStepIndex = Donation.StepsIndex[step]
    var redirectIndex = Donation.ensureSteps(form, targetStepIndex)
    if (redirectIndex < targetStepIndex) {
      res.redirect(Donation.URLs[Donation.IndexToSteps[redirectIndex]])
    }

    // clear session when finished
    if (step == 'confirmation') {
      req.session.form = undefined;
    }

    const element = react.createElement(DonationPage.Steps[step], { form: form, message: message })
    const stream = ReactDOMServer.renderToStaticNodeStream(element)
    stream.pipe(res)
  } else {
    // 404 page
    res.status(404).send('Not found');
  }
});

app.post('/donation/:step', (req, res) => {
  var step = req.params.step
  if (step in Donation.Actions) {
    Donation.Actions[step](req, res)
  } else {
    res.status(404).send('Not found');
  }
});

app.get('/donate_secure_pay', (req, res) => {
  res.render('payment.html')
})

// createdb tha
const sql = require('sql-template-strings');
const pg = require('pg');
const pool = new pg.Pool({
  database: 'tha'
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

const withDb = (req, res, next) => {
  pool.connect((err, client, done) => {
    if (err) return next(err);
    req.db = client;
    const finished = () => {
      if (done) {
        done();
        done = null;
      }
    };
    res.on('finish', finished);
    res.on('close', finished);
    next();
  });
};

app.get('/dbtest', withDb, (req, res, next) => {
  req.db.query(sql`SELECT NOW()`, (err, result) => {
    if (err) return next(err);
    //console.log(err, result.rows[0])
    res.send(result.rows[0]);
  });
});

const port = process.env.PORT || 3939;
require('http')
  .createServer(app)
  .listen(port);
console.log(`server listening on http://localhost:${port}/`);
