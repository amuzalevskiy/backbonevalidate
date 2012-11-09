Bv.Rule.date = Bv.Rule.regexp.extend({
    defaults: {
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg8,
        test: /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/
    }
});