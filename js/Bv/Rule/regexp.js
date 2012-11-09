Bv.Rule.regexp = Bv.Rule.proto.extend({
    isValid: function (v) {
        return this.get('test').test(jQuery.trim(v));
    },
    defaults: {
        test: null
    }
});