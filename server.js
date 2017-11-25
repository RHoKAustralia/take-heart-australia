const express = require('express')
var session = require('express-session')

const app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.send('oh hai')
})

app.get('/donation', (req, res) => {
  req.session.test1 = {a: 10, b: 'bbb'}
  console.log(1, req.session.test1)
  res.send('abc')
})


require('http').createServer(app).listen(3939)
console.log('server listening on http://localhost:3939')
