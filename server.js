const react = require('react')
const ReactDOMServer = require('react-dom/server')
const bodyParser = require('body-parser')

const express = require('express')
const session = require('express-session')
require('node-jsx').install()

const morgan = require('morgan')

const app = express()

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

app.use(morgan('combined'))
app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.send('oh hai')
})

const DonationPages = require('./pages/donation.jsx')
const StepActions = require('./src/donation.js')

app.get('/donation/:step', (req, res) => {
  var step = req.params.step
  if (step in DonationPages.Steps) {
    res.set('content-type', 'text/html')
    const element = react.createElement(DonationPages.Steps[step], {form: req.session.form || {}})
    const stream = ReactDOMServer.renderToStaticNodeStream(element)
    stream.pipe(res)
  } else {
    // 404 page
    res.status(404).send('Not found')
  }
})

app.post('/donation/:step', (req, res) => {
  var step = req.params.step
  if (step in StepActions.Actions) {
    StepActions.Actions[step](req, res)
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
