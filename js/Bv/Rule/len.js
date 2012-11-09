Bv.Rule.len = Bv.Rule.proto.extend({
    isValid: function (v) {
        return jQuery.trim(v).length == this.get("length");
    },
    defaults: {
        length: 0
    }
});