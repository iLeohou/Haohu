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
    const done = function finalHandler(err) {
        res.writeHeader(404, {
            'Content-Tyoe': 'text/plain'
        })
        if(err) {
            res.end('404: '+err)
        } else {
            const msg = 'Cannot' + req.method + ' ' + req.url;
            res.end(msg);
        }
    }
    let router = this._router;
    router.handle(req, res, done)
}

methods.forEach((item) => { // app.get...
    Application.prototype[item] = function(path, fn) {
        this._router[item](path, fn);
        return this; // 返回本实例。
    }
})

module.exports = Application;