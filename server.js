const react = require('react')
const ReactDOMServer = require('react-dom/server')

const express = require('express')
require('node-jsx').install()

const app = express()

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


require('http').createServer(app).listen(3939)
console.log('server listening on http://localhost:3939')
