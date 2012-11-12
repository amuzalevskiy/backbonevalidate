Bv.Rule.Digits = Bv.Rule.extend({
    isValid: function (v) {
        return /^[0-9]+$/.test(jQuery.trim(v));
    }
});