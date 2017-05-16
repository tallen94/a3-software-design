let express = require('express')
let http = require('http')
let path = require('path')
let fs = require('fs')

let app = express()
let server = http.createServer(app)

let router = express.Router()

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json; charset=ascii");
  next();
});

router.get('/edges/:date', (req, res) => {
  let edges = path.join(__dirname, 'data', 'graphs', req.params.date, 'edges.csv')
  res.status(200).sendFile(edges)
})

router.get('/nodes/:date', (req, res) => {
  let nodes = path.join(__dirname, 'data', 'graphs', req.params.date, 'nodes.csv')
  res.status(200).sendFile(nodes)
})

app.use(router)

server.listen(5000, function() {
  console.log("LISTENING")
})