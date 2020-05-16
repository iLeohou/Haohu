function Layer(path, fn) {
    this.handle = fn;
    this.path = path;
    this.name = fn.name || '<anonymous>'
}

Layer.prototype.handle_request = function(req, res) {
    let fn = this.handle;
    if(fn) {
        fn(req, res)
    }
}

Layer.prototype.match = function(path) {
    if(path === this.path || path === '*'){
        return true
    };
    return false
}

module.exports = Layer;