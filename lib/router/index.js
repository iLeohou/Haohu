const Layer = require('./layer');
const Route = require('./route');
const http = require('./http')();

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
    let route = new Route(path); // 创建一个仅有path的route实例
    let layer = new Layer(path, function(req, res) {
        route.dispatch(req, res);
    })
    layer.route = route;
    this.stack.push(layer); // 放入stack内的实例。

    return route; //返回这个route，使用她的实例去添加其他的方法
}
// 判定layer内是否匹配的url和方法。
Router.prototype.handle = function(req, res) {
    method = req.method;

    for(let i = 0;i < this.stack.length;i++) {
        if(this.stack[i].match(req.url) && 
        this.stack[i].route && 
        this.stack[i].route._hasMethod) {
            this.stack[i].handle_request(req, res) // 执行route的匹配，成功则执行get的fn函数。
        }
    }

    return this.stack[0].handle_request(req, res)
}

http.forEach(item => {
    Router.prototype[item] = function(path, fn) {
        let route = this.route(path);
        route[item](fn);

        return this
    }
});

module.exports = new Router;