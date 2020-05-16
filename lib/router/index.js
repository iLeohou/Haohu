const Layer = require('./layer');
const Route = require('./route')

function Router() {
    this.stack = [
        new Layer({
            path: "*",
            handle: function(req, res) {
                res.writeHeader(200,{
                    'Content-Type': 'text/plain'
                });
                res.end('404')
            }
        })
    ]
}

Router.prototype.route = function(path) {
    let route = new Route(path);
    let layer = new Layer(path, function(req, res) {
        route.dispatch(req, res);
    })
    layer.route = route;
    this.stack.push(layer);

    return route;
}

Router.prototype.handle = function(req, res) {
    method = req.method;

    for(let i = 0;i < Router.stack.length;i++) {
        if(this.stack[i].match(req.url) && 
        this.stack[i].route && 
        this.stack[i].route._hasMethod) {
            this.stack[i].handle_request(req, res)
        }
    }
    return this.stack[0].handle_request(req, res)
}


module.exports = new Router;