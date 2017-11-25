const express = require('express')
const app = express()

app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.send('oh hai')
})


require('http').createServer(app).listen(3939)
console.log('server listening on http://localhost:3939')
