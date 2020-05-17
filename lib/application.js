const http = require('http');
const methods = require('./router/http')();
const Router = require('./router')

function Application() {
    this._router = Router
}

Application.prototype.listen = function(port, cb) {
    const server = http.createServer((req, res) => {
        this.handle(req, res)
    })
    return server.listen(port, cb)
}

Application.prototype.handle = function(req, res) {
    if(!res.send) {
        res.send = function(msg) {
            res.writeHeader(200,{"Content-Type": "text/plain"});
            res.end(msg)
        }
    }

    let router = this._router;
    router.handle(req, res)
}

methods.forEach((item) => {
    Application.prototype[item] = function(path, fn) {
        this._router[item](path, fn);
    }
    return this;
})

module.exports = Application;