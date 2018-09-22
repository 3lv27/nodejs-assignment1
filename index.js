'use strict'

// Dependencies
const http = require('http')
const url = require('url')


//Initializing the HTTP server
const httpServer = http.createServer((req, res) => {
  // Get the URL and parse it 
  const parsedUrl = url.parse(req.url, true)

  // Get the path already trimmed
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

  // Get the query string object
  const queryString = parsedUrl.query
  
  // Get the HTTP method
  const method = req.method.toLocaleLowerCase()

  // Get the headers object
  const headers = req.headers

  // Preparing the response on request's end event

  // Choosing the handler, if one is not found, use the notFound handler
  const chosenHandler = typeof (router[path]) !== 'undefined' ? router[path] : handlers.notFound

  const data = {
    path: path,
    queryString: queryString,
    method: method,
    header: headers
  }

  // Route the request to the handler specififed in the router
  chosenHandler(data, (statusCode, payload) => {

    statusCode = typeof (statusCode) === 'number' ? statusCode : 200
    payload = typeof (payload) === 'object' ? JSON.stringify(payload) : {}

    //Return the response
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(statusCode)
    res.end(payload)
  })
})

httpServer.listen(3000, () => {
  console.log(' > HTTP server listening on port 3000')
})

// Define the route handlers
let handlers = {}

//Hello handler
handlers.hello = (data, callback) => {
  if (typeof (data.queryString.name) === 'undefined') {
    data.queryString.name = 'new user'
  }

  callback(200, {status: 1, response: `Hello ${data.queryString.name}`})
}

//Not found handler
handlers.notFound = (data, callback) => {
  callback(404, {status: 0, info: 'Something went wrong'})
}

// Routing all requests to specified handler
const router = {
  hello: handlers.hello,
}

