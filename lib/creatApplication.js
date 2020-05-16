const http = require('http');

const MaxRouter = require('./router')

function creatApplication(){
    return {
        get(path, handle) {
            MaxRouter.get(path, handle)
        },

        listen(port, cb) {
            const server = http.createServer((req, res) => {
                if(!res.send) {
                    res.send = function(msg) {
                        res.writeHeader("Content-Type","text/plain");
                        res.end(msg);
                    }
                }
                MaxRouter.deal(req, res)
            });
            return server.listen(port, cb);
        }
    }
}

module.exports = creatApplication;