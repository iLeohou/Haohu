const http = require('http');

const router = [
    {
        path: "*",
        method: "*",
        handle: function(req, res) {
            res.writeHeader(200,{
                'Content-Type': 'text/plain'
            });
            res.end('404')
        }
    }
]

function creatApplication(){
    return {
        get(path, handle) { //option
            router.push({
                path,
                method: 'GET',
                handle
            })
        },
        listen(port, cb) {
            console.log(router)
            const server = http.createServer((req, res) => {
                if(!res.send) {
                    res.send = function(msg) {
                        res.writeHeader("Content-Type","text/plain");
                        res.end(msg);
                    }
                }
                for(let i = 1; i < router.length; i++) {
                    if((req.url === router[i].path || router[i].path === "*") &&
                    (req.method === router[i].method || router[i].method === "*")){
                        return router[i].handle && router[i].handle(req,res);
                    }
                }
                return router[0].handle(req, res);
            });
            return server.listen(port, cb);
        }
    }
}

module.exports=creatApplication;