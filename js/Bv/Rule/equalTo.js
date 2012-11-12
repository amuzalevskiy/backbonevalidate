Bv.Rule.equalTo = Bv.Rule.extend({
    isValid: function (v) {
        return v == this.get('compareWith').get('value');
    },
    defaults: {
        compareWith: null
    },
    /**
     * also listen to identical field changes
     */
    initialize: function(){
        this.constructor.__super__.initialize.apply(this, arguments);
        var rule = this;
        this.on("change:compareWith", function(){
            this.get('compareWith').on("change:value", function(){
                if (!rule.get('field').get('isValidated')) {
                    return;
                }
                var isValid = rule.isValid(rule.get('field').get('value'));
                if (rule.get('isValid') !== isValid) {
                    rule.set({
                        isValid: isValid
                    });
                }
            });
        }, this);
        this.trigger("change:compareWith");
    }
});