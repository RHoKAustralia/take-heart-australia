const react = require('react')
const ReactDOMServer = require('react-dom/server')
var bodyParser = require('body-parser')

const express = require('express')
var session = require('express-session')
require('node-jsx').install()

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

app.use(express.static(`${__dirname}/public`))

const {MyComponent} = require('./blah.jsx')

app.get('/reactdemo', (req, res) => {
  const elem = react.createElement(MyComponent, {name:'fred', items:['a', 'b']})
  const stream = ReactDOMServer.renderToStaticNodeStream(elem)

  res.set('content-type', 'text/html')
  stream.pipe(res)
})

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


require('http').createServer(app).listen(3939)
console.log('server listening on http://localhost:3939')
