function Layer(path, fn) {
    this.handle = fn;
    this.path = path;
    this.name = "fn.name" || '<anonymous>'; // issue,can not read the fn's name 👿;
}
Layer.prototype.handle_request = function(req, res, next) {
    let fn = this.handle;
    try {
        fn(req, res, next)
    } catch(err) {
        next(err)
    }
}

Layer.prototype.match = function(path) {
    if(path === this.path || path === '*'){
        return true
    };
    return false
}

// 专门捕获错误的函数
Layer.prototype.handle_error = function(error, req, res, next) {
    const fn = this.handle;
    if(fn.length !== 4) return next(error);
    try {
        fn(error, req, res, next)
    } catch(err) {
        next(err)
    }
}

module.exports = Layer;