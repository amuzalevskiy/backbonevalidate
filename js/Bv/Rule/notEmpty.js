Bv.Rule.notEmpty = Bv.Rule.proto.extend({
    isValid: function (v) {
        return jQuery.trim(v).length > 0;
    },
    defaults: {
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg3
    }
});