Bv.Rule.between = Bv.Rule.proto.extend({
    isValid: function (v) {
        v = parseFloat(jQuery.trim(v));
        return v >= this.get('from') && v <= this.get('to');
    },
    defaults: {
        from: 0,
        to: 0,
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg5
    }
});