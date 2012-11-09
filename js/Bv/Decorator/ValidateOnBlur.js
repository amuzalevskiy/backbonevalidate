Bv.Decorator.ValidateOnBlur = Backbone.Model.extend({
    initialize: function(){
        this.on('change:field', function(){
            if (!this.get('field')) {
                return;
            }
            this.get('field').on("change:wasBlur", function(){
                if(this.get('wasBlur')) {
                    this.set({
                        isValidated: true
                    });
                }
            },this.get('field'));
        }, this);
    }
});