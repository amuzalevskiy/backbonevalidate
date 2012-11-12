Bv.Rule.Len = Bv.Rule.extend({
    isValid: function (v) {
        return jQuery.trim(v).length == this.get("length");
    },
    defaults: {
        length: 0
    }
});