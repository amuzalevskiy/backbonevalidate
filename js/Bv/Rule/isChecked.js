Bv.Rule.isChecked = Bv.Rule.proto.extend({
    isValid: function (v) {
        return v;
    },
    defaults: {
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg2
    }
});