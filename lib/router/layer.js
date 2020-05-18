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

module.exports = Layer;