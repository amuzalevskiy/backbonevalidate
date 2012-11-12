Bv.Rule.RegExp = Bv.Rule.extend({
    isValid: function (v) {
        return this.get('test').test(jQuery.trim(v));
    },
    defaults: {
        test: null
    }
});