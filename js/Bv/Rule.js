Bv.Rule = Backbone.Model.extend({
    defaults: {
        field: null,
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg1,
        isValid: undefined,
        isAjaxRequestGoing: false,
        allowEmpty: true,
        validator: null
    },
    isValid: function () {
        return false;
    },
    initialize: function(){
        var rule = this;
        this.on("change:field", function(){
            var field = this.get('field');
            
            field.on("change:value", function(){
                
                var isValid = rule.isValid(field.get('value'));
                
                isValid = isValid || (this.get('allowEmpty') && jQuery.trim(field.get('value')) == '');
                
                if (rule.get('isValid') !== isValid) {
                    rule.set({
                        isValid: isValid
                    });
                }
            }, field);
        });
        this.trigger("change:field");
    }
});