Bv.Rule.NotZero = Bv.Rule.extend({
    isValid: function (v) {
        return jQuery.trim(v) != "0";
    },
    defaults: {
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg4 ,
        allowEmpty: false
    }
});