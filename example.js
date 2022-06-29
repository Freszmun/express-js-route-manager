// express.js server init
const express = require('express'),
    app = express(),
    sv = require('http').createServer(app),
    route = new (require('express').Router)();

app.use('/welcome', route);

sv.listen(3000, () => {
    console.log('Listening on port 3000');
});

// added few endpoints to app and route for testing
app.get('/test', function(req, res) {
    res.writeHead(200).end('app GET /test');
});

app.post('/test', function(req, res) {
    res.writeHead(200).end('app POST /test');
});

route.get('/hello', function(req, res) {
    res.writeHead(200).end('route GET /hello');
});

route.get('/', function(req, res) {
    res.writeHead(200).end('route GET /');
});

route.get('/test', function(req, res) {
    res.writeHead(200).end('route GET /test');
});


// require route manager
const routeManager = require('./route-manager');

// find specified endpoint
console.log(routeManager.findRoute(app, 'endpoint', 'get' ,'/test'));

// find specified route
console.log(routeManager.findRoute(app, 'route', null ,'/welcome'));

// delete GET /test endpoint from app route
routeManager.deleteRoute(app, 'endpoint', 'get' ,'/test')

// find max 2 GET /test endpoints in app route and all routes inside
// let found = routeManager.findRouteRecurrent(app, 'endpoint', 'get' ,'/test', 2);

// find max 2 GET /test endpoints in specified route and all routes inside
let found = routeManager.findRouteRecurrent(route, 'endpoint', 'get' ,'/test', 2);

// delete specified endpoint/route inside parent route/app
routeManager.deleteSpecifiedRoute(found.list[0].parent, found.list[0].layer);

// find max 2 GET /test endpoints in specified route and all routes inside
console.log(routeManager.findRouteRecurrent(app, 'endpoint', 'get' ,'/test', 2));

// get endpoint/route on specified index in parent
console.log(routeManager.getRouteByIndex(app, 0));

// get endpoint/route index in specified parent
let firstAppRoute = routeManager.getRouteByIndex(app, 0);
console.log(routeManager.getRouteIndex(app, firstAppRoute));

// list only routes and endpoints inside app
console.log(routeManager.listRoute(app, true));

// recurrent list all routes and endpoints inside app and it's routes
console.log(routeManager.treeRoute(app, false, true));
