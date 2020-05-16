const Layer = require('./layer');

const Route = function(path) {
    this.path = path;
    this.stack = [];
    this.methods = {};
}

Route.prototype._hasMethod = function(method) {
    let name = method.toLowerCase();
    return Boolean(this.methods[name]);
}

Route.prototype.get = function(fn) {
    let layer = new Layer('/', fn);
    layer.method = "get";

    this.methods['get'] = true;
    this.stack.push(layer);

    return this
}

Route.prototype.dispatch = function(req, res) {
    let method = req.method.toLowerCase();
    for(let i = 0; i < this.stack.length; i++) {
        if(method === this.stack[i].method) {
            return this.stack[i].handle_request(req, res);
        }
    }
}

module.exports = Route