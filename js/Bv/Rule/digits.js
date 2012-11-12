Bv.Rule.digits = Bv.Rule.extend({
    isValid: function (v) {
        return /^[0-9]+$/.test(jQuery.trim(v));
    },
    defaults: {
        length: 0,
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg6
    }
});