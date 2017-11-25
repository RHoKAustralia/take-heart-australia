const react = require('react')
const ReactDOMServer = require('react-dom/server')

const express = require('express')
require('node-jsx').install()

const morgan = require('morgan')

const app = express()

app.use(morgan('combined'))
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

require('http').createServer(app).listen(3939)
console.log('server listening on http://localhost:3939')
