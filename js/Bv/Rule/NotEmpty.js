Bv.Rule.NotEmpty = Bv.Rule.extend({
    isValid: function (v) {
        return jQuery.trim(v).length > 0;
    }
});