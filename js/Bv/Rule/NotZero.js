Bv.Rule.NotZero = Bv.Rule.extend({
    isValid: function (v) {
        return jQuery.trim(v) != "0";
    },
    defaults: {
        allowEmpty: false
    }
});