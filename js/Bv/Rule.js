Bv.Rule = Backbone.Model.extend({
    defaults: {
        field: null,
        translator: null,
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
                var val = field.get('value'),
                isValid = rule.isValid(val) || (this.get('allowEmpty') && jQuery.trim(val) == '');
                
                rule.set({
                    isValid: isValid
                });
            }, field);
        });
        this.trigger("change:field");
    }
});