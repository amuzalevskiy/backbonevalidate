Bv.Dictionary = {
    values:{},
    get: function (key) {
        return this.values[key];
    },
    has: function (key) {
        return typeof this.values[key] != 'undefined';
    },
    set: function (key, value) {
        this.values[key] = value;
    }
}