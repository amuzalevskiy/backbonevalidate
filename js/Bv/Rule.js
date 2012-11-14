Bv.Rule = Backbone.Model.extend({
    defaults: {
        field: null,
        isValid: undefined,
        isAjaxRequestGoing: false,
        allowEmpty: true,
        validator: null
    },
    
    isValid: function () {
        return false;
    },
    
    initialize: function(){
        this.on("change:field", function(){
            this.get('field').on("change:value", this.makeCheck, this);
            this.addDependencies();
        }, this);
    },
    
    getMessage: function (dictionary) {
        if (this.has('message')) {
            return this.get('message');
        }
        
        if (dictionary.has('message')) {
            return dictionary.get('message');
        }
        
        return "DEV: No message set";
    },
    
    makeCheck: function(){
        var field = this.get('field'),
        val = field.get('value'),
        isValid = this.isValid(val) || (field.get('allowEmpty') && jQuery.trim(val) == '');
                
        this.set({
            isValid: isValid
        });
    },
    
    // to override
    addDependencies: function (){
        
    }
});