const Layer = require('./layer');
const Route = require('./route');
const http = require('./http')();

function Router() {
    this.stack = [];
}

Router.prototype.route = function(path) {
    let route = new Route(path); // 创建一个仅有path的route实例
    let layer = new Layer(path, route.dispatch.bind(route))
    layer.route = route;
    this.stack.push(layer); // 放入stack内的实例。

    return route; //返回这个route，使用她的实例去添加其他的方法
}
// 判定layer内是否匹配的url和方法。
Router.prototype.handle = function(req, res, done) {
    let method = req.method;
    let index = 0, stack = this.stack;

    function next(err) { // 递归函数
        let layerError = (err === 'route' ? null : err);
        if(layerError === 'router') {
            return done(null)
        }
        if(index >= stack.length || layerError) {
            return done(layerError);
        }

        let layer = stack[index++];

        if(layer.match(req.url) && layer.route && layer.route._hasMethod(method)) {
            return layer.handle_request(req, res, next) // 调用next才可以继续往下执行下一个路由。index不会重置。
        } else {
            next(layerError)
        }
    }

    next() // 只调用一次
}

http.forEach(item => {
    Router.prototype[item] = function(path, fn) {
        let route = this.route(path); // app.get...
        route[item](fn);// 此处为route 非layout实例。

        return this
    }
});

module.exports = new Router;