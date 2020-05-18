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

Route.prototype.dispatch = function(req, res, done) {
    let method = req.method.toLowerCase();
    let index = 0, stack = this.stack;
    function next(err) { // next 跳过route
        if(err && err === "route") {
            return done();
        }
        if(err && err === "router") {
            return done(err);
        }
        if(index >= stack.length) {
            return done(err);
        }
        let layer = stack[index++];
        if(method !== layer.method) {
            return next(err)
        }

        if(err) {
            return done(err)
        } else {
            layer.handle_request(req, res, next);
        }
    }
    next()
}

module.exports = Route