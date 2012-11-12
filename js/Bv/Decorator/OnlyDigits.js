Bv.Decorator.OnlyDigits = Backbone.Model.extend({

    initialize: function(){
        this.on('change:field', function(){
            if (!this.get('field')) {
                return;
            }
            this.get('field').get('dom').numeric();
        }, this);

        this.trigger("change:field");
    }
    
})